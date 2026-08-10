# BUS311 Mission Control

BUS311 Mission Control is the instructor-facing macOS app for Fall 2026 lesson access and the selected current lesson. It reads and writes the maintained `terms/fall-2026.json` `releaseState` and `currentLessonId` fields; the student homepage derives its “This week” view from that same source, while locked lessons remain noninteractive upcoming previews.

Use `swift run` from this directory during development. Saving runs the maintained homepage builder and public site validator. Saving never commits, pushes, or publishes the change.
