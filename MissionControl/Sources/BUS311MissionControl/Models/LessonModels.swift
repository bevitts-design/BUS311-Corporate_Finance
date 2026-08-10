import Foundation

struct LessonAccess: Identifiable, Equatable {
    let id: String
    let track: String
    let module: String
    let title: String
    let week: Int
    let dateLabel: String
    let releaseState: String

    var isAvailable: Bool { releaseState == "Available" }
}

struct CourseSnapshot {
    let lessons: [LessonAccess]
    let currentLessonId: String
    let sourceData: Data
    let sourceURL: URL
    let repositoryRoot: URL
}

struct AccessChange: Identifiable {
    let lesson: LessonAccess
    let willBeAvailable: Bool
    var id: String { lesson.id }
}
