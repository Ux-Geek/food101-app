// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Food101",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .executable(name: "Food101", targets: ["Food101"])
    ],
    targets: [
        .executableTarget(
            name: "Food101",
            path: "Sources"
        )
    ]
)

