import SwiftUI

struct CurrentLessonPicker: View {
    @ObservedObject var store: MissionControlStore

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Current lesson on the homepage", systemImage: "star.circle.fill")
                .font(.headline)
            if store.snapshot != nil {
                Picker("Current lesson", selection: Binding(
                    get: { store.currentLessonDraft },
                    set: { id in
                        if let lesson = store.lessons.first(where: { $0.id == id }) {
                            store.makeCurrent(lesson)
                        }
                    }
                )) {
                    ForEach(store.lessons) { lesson in
                        Text("\(lesson.module) · \(lesson.title)").tag(lesson.id)
                    }
                }
                .pickerStyle(.menu)
                .labelsHidden()
                .accessibilityLabel("Current lesson on the homepage")
                .frame(maxWidth: .infinity, alignment: .leading)
                .disabled(store.isWorking)
                if store.currentLessonChanged {
                    Label("Selection pending — Save and rebuild to apply", systemImage: "pencil.circle")
                        .font(.callout).foregroundStyle(.orange)
                }
            } else {
                Text("Reload the course source to choose a lesson.").foregroundStyle(.secondary)
            }
            Text("Choose the lesson to highlight for students. It will also be made available. Save and rebuild, then use Publish to GitHub when you are ready to update the live website.")
                .font(.footnote).foregroundStyle(.secondary)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.background.secondary, in: RoundedRectangle(cornerRadius: 10))
    }
}
