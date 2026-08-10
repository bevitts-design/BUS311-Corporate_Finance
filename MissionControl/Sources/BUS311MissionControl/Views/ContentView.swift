import SwiftUI

struct ContentView: View {
    @ObservedObject var store: MissionControlStore
    var body: some View {
        NavigationSplitView {
            List(selection: $store.selectedSection) {
                Section("Course Controls") { navigationRow("access", title: "Lesson Access", subtitle: "Choose which lessons students can open", icon: "lock.open") }
                Section("Publishing") { navigationRow("publish", title: "Publish to GitHub", subtitle: "Review, commit, and push safely", icon: "arrow.up.circle") }
            }
            .listStyle(.sidebar)
            .navigationSplitViewColumnWidth(min: 220, ideal: 245, max: 285)
            .safeAreaInset(edge: .bottom) {
                RepositoryStatusView(store: store)
            }
        } detail: {
            detail
        }
    }
    private var detail: some View {
        VStack(spacing: 0) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 5) {
                    Text("BUS311 Mission Control").font(.largeTitle.weight(.semibold))
                    Text("Corporate Finance lesson access").foregroundStyle(.secondary)
                    Text("Every lesson card stays on the student site. Locked cards show what is coming without an active lesson link.").font(.callout).foregroundStyle(.secondary)
                }
                Spacer()
                Text("\(store.availableCount) of \(store.lessons.count) available").font(.callout.monospacedDigit()).foregroundStyle(.secondary)
            }.padding(20)
            if let error = store.errorMessage { Label(error, systemImage: "exclamationmark.triangle.fill").foregroundStyle(.red).padding(.horizontal, 20).padding(.bottom, 12) }
            if let success = store.successMessage { Label(success, systemImage: "checkmark.circle.fill").foregroundStyle(.green).padding(.horizontal, 20).padding(.bottom, 12) }
            Divider()
            if store.selectedSection == "access" {
                HSplitView {
                    lessonList.frame(minWidth: 560)
                    preview.frame(minWidth: 300, idealWidth: 340)
                }
            } else {
                publishView
            }
        }
        .toolbar {
            Button { store.load() } label: { Label("Reload", systemImage: "arrow.clockwise") }.disabled(store.isDirty || store.isWorking)
            if store.selectedSection == "access" { Button("Discard") { store.discard() }.disabled(!store.isDirty || store.isWorking)
            Button { store.save() } label: { Label("Save and rebuild", systemImage: "hammer") }.disabled(!store.isDirty || store.isWorking)
                .keyboardShortcut("s", modifiers: [.command])
            }
        }
    }
    private func navigationRow(_ tag: String, title: String, subtitle: String, icon: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon).foregroundStyle(.secondary).frame(width: 18)
            VStack(alignment: .leading, spacing: 2) { Text(title); Text(subtitle).font(.caption).foregroundStyle(.secondary).lineLimit(1) }
        }.tag(tag)
    }
    private var lessonList: some View {
        VStack(alignment: .leading, spacing: 0) {
            TextField("Search lessons", text: $store.searchText).textFieldStyle(.roundedBorder).padding(20)
            ScrollView { LazyVStack(alignment: .leading, spacing: 16) {
                ForEach(["intro", "valuation", "decisions"], id: \.self) { track in
                    let lessons = filtered(track)
                    if !lessons.isEmpty { VStack(alignment: .leading, spacing: 8) {
                        Text(track == "intro" ? "Understand the Business" : track == "valuation" ? "Value the Cash Flows" : "Recommend the Decision").font(.title3.weight(.semibold))
                        ForEach(lessons) { lesson in LessonRow(lesson: lesson, isAvailable: Binding(get: { store.draft[lesson.id] ?? lesson.isAvailable }, set: { store.setAvailable($0, for: lesson) })) }
                    }}
                }
            }.padding(20) }
        }
    }
    private var preview: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Change preview").font(.title3.weight(.semibold))
            if store.changes.isEmpty { ContentUnavailableView("No pending changes", systemImage: "checkmark.circle", description: Text("Turn a lesson on or off to preview the student-access change.")) }
            else { ScrollView { LazyVStack(alignment: .leading, spacing: 10) { ForEach(store.changes) { change in Label("\(change.willBeAvailable ? "Unlock" : "Lock") · \(change.lesson.module) · \(change.lesson.title)", systemImage: change.willBeAvailable ? "lock.open" : "lock") .frame(maxWidth: .infinity, alignment: .leading).padding(10).background(.background.secondary, in: RoundedRectangle(cornerRadius: 8)) } } } }
            Spacer()
            Button { store.save() } label: {
                Label("Save changes and rebuild", systemImage: "hammer")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .disabled(!store.isDirty || store.isWorking)
            Text("Saving updates Fall 2026 term data, regenerates the course hub, and runs the site validator. Publishing to GitHub remains a separate step.").font(.footnote).foregroundStyle(.secondary)
        }.padding(20)
    }
    private var publishView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Publish to GitHub").font(.title2.weight(.semibold))
            Text("Publishing is separate from saving. Preflight fetches GitHub, confirms the main branch is current, rebuilds and validates the student site, then lets you explicitly choose the reviewed files to commit and push.").foregroundStyle(.secondary)
            HStack { Button { store.runPublishPreflight() } label: { Label("Run publishing preflight", systemImage: "checkmark.shield") }.disabled(store.isWorking || store.isDirty); if store.isWorking { ProgressView() } }
            if let preflight = store.publishPreflight {
                Divider(); Text(preflight.summary).font(.headline)
                List(preflight.changedPaths, id: \.self, selection: $store.selectedPublishPaths) { path in Text(path).font(.callout.monospaced()) }.frame(minHeight: 180)
                TextField("Commit message", text: $store.publishMessage).textFieldStyle(.roundedBorder)
                HStack { Spacer(); Button(role: .destructive) { store.showPublishConfirmation = true } label: { Label("Commit and push to main", systemImage: "arrow.up.circle.fill") }.disabled(store.selectedPublishPaths.isEmpty || store.publishMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || store.isWorking) }
            } else {
                ContentUnavailableView("Run preflight before publishing", systemImage: "icloud.and.arrow.up", description: Text("No files will be staged, committed, or pushed until preflight is complete and you confirm the selected scope."))
            }
            Spacer()
        }.padding(20)
        .alert("Push reviewed changes to GitHub?", isPresented: $store.showPublishConfirmation) {
            Button("Cancel", role: .cancel) {}
            Button("Commit and push", role: .destructive) { store.publishReviewedChanges() }
        } message: { Text("This will commit and push only the selected reviewed files to the main branch. GitHub Pages deployment will start afterward.") }
    }
    private func filtered(_ track: String) -> [LessonAccess] {
        let query = store.searchText.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        return store.lessons.filter { $0.track == track && (query.isEmpty || "\($0.module) \($0.title) \($0.dateLabel)".lowercased().contains(query)) }
    }
}

private struct RepositoryStatusView: View {
    @ObservedObject var store: MissionControlStore

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Label(store.snapshot == nil ? "Course source unavailable" : "Course source connected",
                  systemImage: store.snapshot == nil ? "exclamationmark.triangle" : "checkmark.circle")
                .font(.caption.weight(.semibold))
                .foregroundStyle(store.snapshot == nil ? .orange : .green)
            if let path = store.repositoryPath {
                Text(path)
                    .font(.caption2.monospaced())
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
                    .help(path)
            } else {
                Text("Looking for the BUS311 course repository.")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.regularMaterial)
    }
}

private struct LessonRow: View {
    let lesson: LessonAccess
    @Binding var isAvailable: Bool
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: isAvailable ? "building.2.crop.circle.fill" : "lock.fill").foregroundStyle(isAvailable ? .green : .secondary).font(.title3)
            VStack(alignment: .leading, spacing: 3) { Text("Week \(lesson.week) · \(lesson.module) · \(lesson.dateLabel)").font(.caption).foregroundStyle(.secondary); Text(lesson.title).font(.headline) }
            Spacer()
            Toggle(isOn: $isAvailable) { Text(isAvailable ? "Available" : "Locked").frame(width: 70, alignment: .trailing) }.toggleStyle(.switch).accessibilityLabel("\(lesson.title) student access")
        }.padding(12).background(.background.secondary, in: RoundedRectangle(cornerRadius: 10))
    }
}
