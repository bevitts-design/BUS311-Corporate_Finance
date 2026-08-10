// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "BUS311MissionControl",
    platforms: [.macOS(.v14)],
    products: [.executable(name: "BUS311MissionControl", targets: ["BUS311MissionControl"])],
    targets: [.executableTarget(name: "BUS311MissionControl", path: "Sources/BUS311MissionControl")],
    swiftLanguageModes: [.v5]
)
