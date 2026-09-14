# BUS311 Mission Control

Native macOS app for Fall 2026 lesson access and the current lesson. It reads and writes the maintained `terms/fall-2026.json` `releaseState` and `currentLessonId` fields.

## Change the current lesson

1. Open **Lesson Access** and choose a lesson from **Current lesson on the homepage** above the search field. Each option includes the module and lesson title.
2. Review the pending selection and any access changes. Selecting a locked lesson also makes it available; other lessons keep their access settings.
3. Click **Save changes and rebuild** (or press Command-S). The app saves the term settings, regenerates the homepage, and runs the public site validator.
4. Use **Publish to GitHub** separately when ready to update the live website.

**Discard** restores the saved selection. **Reload** reads changes made outside the app when there are no pending edits. The lesson-row **Make current** buttons remain available.

## Build and run

Run `./script/build_and_run.sh --verify` from this directory to build, stage, sign, and launch the local app bundle. To refresh the existing Desktop app too, run with `BUS311_INSTALL_DESKTOP=1`. Saving and building never commit, push, or publish course changes.
