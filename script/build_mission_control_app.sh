#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/MissionControl"
DIST_DIR="$PACKAGE_DIR/dist"
APP_NAME="BUS311 Mission Control"
PROCESS_NAME="BUS311MissionControl"
STAGE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/bus311-mission-control.XXXXXX")"
trap 'rm -rf "$STAGE_DIR"' EXIT

swift build --package-path "$PACKAGE_DIR" --scratch-path "$STAGE_DIR/build"
BIN_DIR="$(swift build --package-path "$PACKAGE_DIR" --scratch-path "$STAGE_DIR/build" --show-bin-path)"
APP="$STAGE_DIR/$APP_NAME.app"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" "$DIST_DIR"
cp "$BIN_DIR/$PROCESS_NAME" "$APP/Contents/MacOS/$PROCESS_NAME"
"$ROOT_DIR/script/build_mission_control_icon.sh" "$APP/Contents/Resources/BUS311MissionControl.icns"
cat > "$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleExecutable</key><string>BUS311MissionControl</string>
  <key>CFBundleIdentifier</key><string>edu.endicott.bus311.mission-control</string>
  <key>CFBundleIconFile</key><string>BUS311MissionControl.icns</string>
  <key>CFBundleName</key><string>BUS311 Mission Control</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>CFBundleShortVersionString</key><string>0.1</string>
  <key>LSMinimumSystemVersion</key><string>14.0</string>
  <key>NSPrincipalClass</key><string>NSApplication</string>
</dict></plist>
PLIST
/usr/bin/codesign --force --sign - --identifier edu.endicott.bus311.mission-control "$APP"
rm -rf "$DIST_DIR/$APP_NAME.app"
/usr/bin/ditto --norsrc "$APP" "$DIST_DIR/$APP_NAME.app"
/usr/bin/codesign --verify --deep --strict "$DIST_DIR/$APP_NAME.app"
echo "$DIST_DIR/$APP_NAME.app"
