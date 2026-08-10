import Foundation

@MainActor
final class MissionControlStore: ObservableObject {
    @Published private(set) var snapshot: CourseSnapshot?
    @Published private(set) var draft: [String: Bool] = [:]
    @Published private(set) var currentLessonDraft = ""
    @Published private(set) var errorMessage: String?
    @Published private(set) var successMessage: String?
    @Published private(set) var isWorking = false
    @Published var searchText = ""
    @Published private(set) var publishPreflight: PublishPreflight?
    @Published var selectedPublishPaths = Set<String>()
    @Published var publishMessage = "Publish BUS311 Mission Control"
    @Published var selectedSection = "access"
    @Published var showPublishConfirmation = false
    private let service = CourseReleaseService()
    private let publisher = GitPublishService()

    var lessons: [LessonAccess] { snapshot?.lessons ?? [] }
    var repositoryPath: String? { snapshot?.repositoryRoot.path }
    var changes: [AccessChange] { lessons.compactMap { lesson in guard draft[lesson.id] != lesson.isAvailable else { return nil }; return AccessChange(lesson: lesson, willBeAvailable: draft[lesson.id] ?? false) } }
    var selectedCurrentLesson: LessonAccess? { lessons.first { $0.id == currentLessonDraft } }
    var currentLessonChanged: Bool { guard let snapshot else { return false }; return currentLessonDraft != snapshot.currentLessonId }
    var isDirty: Bool { !changes.isEmpty || currentLessonChanged }
    var availableCount: Int { lessons.filter { draft[$0.id] ?? $0.isAvailable }.count }

    func load() {
        guard !isWorking else { return }
        do {
            let loaded = try service.load()
            snapshot = loaded
            draft = Dictionary(uniqueKeysWithValues: loaded.lessons.map { ($0.id, $0.isAvailable) })
            currentLessonDraft = loaded.currentLessonId
            errorMessage = nil; successMessage = nil
        } catch { errorMessage = error.localizedDescription }
    }
    func setAvailable(_ value: Bool, for lesson: LessonAccess) {
        guard value || lesson.id != currentLessonDraft else {
            errorMessage = "Choose another current lesson before locking this one."
            return
        }
        draft[lesson.id] = value
        errorMessage = nil; successMessage = nil
    }
    func makeCurrent(_ lesson: LessonAccess) {
        currentLessonDraft = lesson.id
        draft[lesson.id] = true
        errorMessage = nil; successMessage = nil
    }
    func discard() {
        if let snapshot {
            draft = Dictionary(uniqueKeysWithValues: snapshot.lessons.map { ($0.id, $0.isAvailable) })
            currentLessonDraft = snapshot.currentLessonId
        }
        errorMessage = nil
    }
    func save() {
        guard let snapshot, isDirty, !isWorking else { return }
        isWorking = true; errorMessage = nil
        let desired = draft
        let desiredCurrentLesson = currentLessonDraft
        Task { @MainActor in
            var wroteTermData = false
            do {
                try service.save(snapshot: snapshot, availability: desired, currentLessonId: desiredCurrentLesson)
                wroteTermData = true
                let process = Process()
                process.currentDirectoryURL = snapshot.repositoryRoot
                process.executableURL = URL(fileURLWithPath: "/bin/zsh")
                let node = ProcessInfo.processInfo.environment["BUS311_NODE_PATH"] ?? "/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
                process.arguments = ["-lc", "'\(node)' scripts/build-index.mjs --term fall-2026 && python3 scripts/validate-public.py --site-only"]
                try process.run(); process.waitUntilExit()
                guard process.terminationStatus == 0 else { throw CourseReleaseError.writeFailed("The homepage build or validation failed.") }
                let reloaded = try service.load()
                self.snapshot = reloaded
                self.draft = Dictionary(uniqueKeysWithValues: reloaded.lessons.map { ($0.id, $0.isAvailable) })
                self.currentLessonDraft = reloaded.currentLessonId
                successMessage = "Saved the current lesson and access changes, then rebuilt the student homepage."
            } catch {
                if wroteTermData { try? service.restore(snapshot) }
                errorMessage = "No change was kept because rebuilding the student homepage did not complete. \(error.localizedDescription)"
            }
            isWorking = false
        }
    }
    func runPublishPreflight() {
        guard let root = snapshot?.repositoryRoot, !isWorking else { return }
        isWorking = true; errorMessage = nil; successMessage = nil
        let publisher = publisher
        Task.detached(priority: .userInitiated) {
            let preflight: PublishPreflight?
            let failure: String?
            do { preflight = try publisher.preflight(repositoryRoot: root); failure = nil }
            catch { preflight = nil; failure = error.localizedDescription }
            await MainActor.run {
                if let preflight {
                    self.publishPreflight = preflight
                    self.selectedPublishPaths = Set(preflight.changedPaths)
                    self.successMessage = preflight.summary
                } else {
                    self.publishPreflight = nil
                    self.selectedPublishPaths = []
                    self.errorMessage = failure ?? "GitHub preflight could not complete."
                }
                self.isWorking = false
            }
        }
    }
    func publishReviewedChanges() {
        guard let root = snapshot?.repositoryRoot, !isWorking else { return }
        isWorking = true; errorMessage = nil
        let publisher = publisher
        let paths = Array(selectedPublishPaths).sorted()
        let message = publishMessage
        Task.detached(priority: .userInitiated) {
            let success: String?
            let failure: String?
            do { success = try publisher.publish(repositoryRoot: root, paths: paths, message: message); failure = nil }
            catch { success = nil; failure = error.localizedDescription }
            await MainActor.run {
                if let success {
                    self.successMessage = success
                    self.publishPreflight = nil
                    self.selectedPublishPaths = []
                    self.load()
                } else {
                    self.errorMessage = failure ?? "GitHub publishing could not complete."
                }
                self.isWorking = false
            }
        }
    }
}
