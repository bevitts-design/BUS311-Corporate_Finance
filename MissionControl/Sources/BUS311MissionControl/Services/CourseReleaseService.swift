import Foundation

enum CourseReleaseError: LocalizedError {
    case repositoryNotFound
    case invalidSource(String)
    case externallyModified
    case writeFailed(String)

    var errorDescription: String? {
        switch self {
        case .repositoryNotFound: "BUS311 Mission Control could not locate the live course repository."
        case .invalidSource(let detail): "The Fall 2026 term data is not safe to edit: \(detail)"
        case .externallyModified: "The term data changed after it was loaded. Reload before saving so another edit is not overwritten."
        case .writeFailed(let detail): "The release changes could not be written: \(detail)"
        }
    }
}

struct CourseReleaseService {
    func load() throws -> CourseSnapshot {
        let root = try locateRepository()
        let mapURL = root.appendingPathComponent("course-map.json")
        let termURL = root.appendingPathComponent("terms/fall-2026.json")
        let mapData = try Data(contentsOf: mapURL)
        let termData = try Data(contentsOf: termURL)
        guard let map = try JSONSerialization.jsonObject(with: mapData) as? [String: Any],
              let term = try JSONSerialization.jsonObject(with: termData) as? [String: Any],
              let lessons = map["lessons"] as? [[String: Any]],
              let schedule = term["schedule"] as? [[String: Any]],
              let currentLessonId = term["currentLessonId"] as? String else {
            throw CourseReleaseError.invalidSource("course-map.json and terms/fall-2026.json must contain lessons, schedule, and currentLessonId.")
        }
        let lessonByID = Dictionary(uniqueKeysWithValues: lessons.compactMap { row -> (String, [String: Any])? in
            guard let id = row["id"] as? String else { return nil }; return (id, row)
        })
        let access = try schedule.map { row -> LessonAccess in
            guard let id = row["lessonId"] as? String,
                  let lesson = lessonByID[id],
                  let module = lesson["displayModule"] as? String,
                  let title = lesson["title"] as? String,
                  let track = lesson["track"] as? String,
                  let week = row["week"] as? Int,
                  let dateLabel = row["dateLabel"] as? String,
                  let state = row["releaseState"] as? String,
                  ["Available", "Locked"].contains(state) else {
                throw CourseReleaseError.invalidSource("Each scheduled lesson needs a valid releaseState.")
            }
            return LessonAccess(id: id, track: track, module: module, title: title, week: week, dateLabel: dateLabel, releaseState: state)
        }
        guard access.contains(where: { $0.id == currentLessonId }) else {
            throw CourseReleaseError.invalidSource("currentLessonId must match a scheduled lesson.")
        }
        return CourseSnapshot(lessons: access, currentLessonId: currentLessonId, sourceData: termData, sourceURL: termURL, repositoryRoot: root)
    }

    func save(snapshot: CourseSnapshot, availability: [String: Bool], currentLessonId: String) throws {
        let current = try Data(contentsOf: snapshot.sourceURL)
        guard current == snapshot.sourceData else { throw CourseReleaseError.externallyModified }
        guard var root = try JSONSerialization.jsonObject(with: current) as? [String: Any],
              var schedule = root["schedule"] as? [[String: Any]] else {
            throw CourseReleaseError.invalidSource("The schedule could not be read.")
        }
        guard schedule.contains(where: { ($0["lessonId"] as? String) == currentLessonId }) else {
            throw CourseReleaseError.invalidSource("The selected current lesson is not scheduled.")
        }
        guard availability[currentLessonId] == true else {
            throw CourseReleaseError.invalidSource("The current lesson must also be available to students.")
        }
        for index in schedule.indices {
            guard let id = schedule[index]["lessonId"] as? String, let available = availability[id] else { continue }
            schedule[index]["releaseState"] = available ? "Available" : "Locked"
        }
        root["schedule"] = schedule
        root["currentLessonId"] = currentLessonId
        do {
            let updated = try JSONSerialization.data(withJSONObject: root, options: [.prettyPrinted, .sortedKeys])
            try updated.write(to: snapshot.sourceURL, options: .atomic)
        } catch { throw CourseReleaseError.writeFailed(error.localizedDescription) }
    }

    func restore(_ snapshot: CourseSnapshot) throws { try snapshot.sourceData.write(to: snapshot.sourceURL, options: .atomic) }

    private func locateRepository() throws -> URL {
        let manager = FileManager.default
        let candidates = [
            ProcessInfo.processInfo.environment["BUS311_REPO_ROOT"],
            (manager.urls(for: .documentDirectory, in: .userDomainMask).first?.appendingPathComponent("GitHub/BUS311-Corporate_Finance").path),
            URL(fileURLWithPath: #filePath).deletingLastPathComponent().appendingPathComponent("../../../../").standardizedFileURL.path,
        ].compactMap { $0 }
        guard let path = candidates.first(where: { manager.fileExists(atPath: URL(fileURLWithPath: $0).appendingPathComponent("course-map.json").path) && manager.fileExists(atPath: URL(fileURLWithPath: $0).appendingPathComponent("terms/fall-2026.json").path) }) else { throw CourseReleaseError.repositoryNotFound }
        return URL(fileURLWithPath: path)
    }
}
