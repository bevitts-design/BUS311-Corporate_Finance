import Foundation

struct PublishPreflight: Sendable {
    let changedPaths: [String]
    let summary: String
}

enum GitPublishError: LocalizedError {
    case failed(String)
    var errorDescription: String? { if case let .failed(message) = self { message } else { "GitHub publishing could not continue." } }
}

struct GitPublishService {
    func preflight(repositoryRoot: URL) throws -> PublishPreflight {
        let branch = try run("git branch --show-current", in: repositoryRoot).trimmingCharacters(in: .whitespacesAndNewlines)
        guard branch == "main" else { throw GitPublishError.failed("Publishing is available only from the main branch. Current branch: \(branch).") }
        _ = try run("git fetch origin main", in: repositoryRoot)
        let behind = try run("git rev-list --count HEAD..origin/main", in: repositoryRoot).trimmingCharacters(in: .whitespacesAndNewlines)
        guard behind == "0" else { throw GitPublishError.failed("The local main branch is behind GitHub. Pull and review the remote changes before publishing.") }
        let status = try run("git status --porcelain=v1 -z --untracked-files=all", in: repositoryRoot)
        let allPaths = status.split(separator: "\0").compactMap { entry -> String? in
            guard entry.count >= 4 else { return nil }
            return String(entry.dropFirst(3))
        }
        let paths = allPaths.filter(allowed).sorted()
        guard !paths.isEmpty else { throw GitPublishError.failed("There are no Mission Control changes ready to publish.") }
        let excluded = allPaths.filter { !allowed($0) }
        guard excluded.isEmpty else { throw GitPublishError.failed("Preflight found unrelated changes outside the Mission Control scope. They will not be staged; clear or move them before publishing.") }
        let node = ProcessInfo.processInfo.environment["BUS311_NODE_PATH"] ?? "/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
        _ = try run("'\(node)' scripts/build-index.mjs --term fall-2026 && python3 scripts/validate-public.py --site-only", in: repositoryRoot)
        return PublishPreflight(changedPaths: paths, summary: "Preflight passed. \(paths.count) reviewed file\(paths.count == 1 ? "" : "s") can be staged explicitly.")
    }

    func publish(repositoryRoot: URL, paths: [String], message: String) throws -> String {
        guard !paths.isEmpty else { throw GitPublishError.failed("Select at least one reviewed file before publishing.") }
        guard !message.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { throw GitPublishError.failed("Enter a commit message before publishing.") }
        let quotedPaths = paths.map(shellQuote).joined(separator: " ")
        _ = try run("git add -- \(quotedPaths)", in: repositoryRoot)
        _ = try run("git diff --cached --check", in: repositoryRoot)
        _ = try run("git commit -m \(shellQuote(message))", in: repositoryRoot)
        _ = try run("git push origin main", in: repositoryRoot)
        return "Published the reviewed Mission Control changes to GitHub. The student site deployment remains a separate GitHub Pages step."
    }

    private func allowed(_ path: String) -> Bool {
        path == "assets/index.css" || path == "scripts/build-index.mjs" || path == "scripts/validate-public.py" || path == "terms/fall-2026.json" || path == "index.html" || path.hasPrefix("script/build_mission_control_") || path.hasPrefix("MissionControl/") || path.hasSuffix("/index.html")
    }
    private func run(_ command: String, in root: URL) throws -> String {
        let process = Process(); let pipe = Pipe()
        process.currentDirectoryURL = root; process.executableURL = URL(fileURLWithPath: "/bin/zsh"); process.arguments = ["-lc", command]
        process.standardOutput = pipe; process.standardError = pipe
        try process.run(); process.waitUntilExit()
        let output = String(data: pipe.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8) ?? ""
        guard process.terminationStatus == 0 else { throw GitPublishError.failed(output.isEmpty ? "A GitHub publishing command failed." : output) }
        return output
    }
    private func shellQuote(_ value: String) -> String { "'\(value.replacingOccurrences(of: "'", with: "'\\\"'\\\"'"))'" }
}
