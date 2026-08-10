import AppKit
import SwiftUI

@main
@MainActor
final class BUS311MissionControlApp: NSObject, NSApplicationDelegate {
    private var store: MissionControlStore?
    private var window: NSWindow?

    static func main() {
        let application = NSApplication.shared
        let delegate = BUS311MissionControlApp()
        application.delegate = delegate
        application.setActivationPolicy(.regular)
        application.run()
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        showMainWindow()
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        showMainWindow()
        return true
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    private func showMainWindow() {
        if let window {
            window.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)
            return
        }

        let store = MissionControlStore()
        let controller = NSHostingController(rootView: ContentView(store: store))
        let window = NSWindow(contentViewController: controller)
        window.title = "BUS311 Mission Control"
        window.styleMask = [.titled, .closable, .miniaturizable, .resizable]
        window.setContentSize(NSSize(width: 1_120, height: 740))
        window.minSize = NSSize(width: 920, height: 620)
        window.center()
        window.isReleasedWhenClosed = false
        self.store = store
        self.window = window
        store.load()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }
}
