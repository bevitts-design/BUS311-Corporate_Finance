#!/usr/bin/env bash
set -euo pipefail
MODE="${1:---verify}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="BUS311MissionControl"
APP_BUNDLE="$ROOT_DIR/dist/BUS311 Mission Control.app"
case "$MODE" in run|--verify|--logs|--telemetry|--debug) ;; *) echo "Usage: $0 [run|--verify|--logs|--telemetry|--debug]" >&2; exit 2 ;; esac
cd "$ROOT_DIR"
swift build -c release
BUILD_BINARY="$(swift build -c release --show-bin-path)/$APP_NAME"
pkill -x "$APP_NAME" >/dev/null 2>&1 || true
mkdir -p "$APP_BUNDLE/Contents/MacOS"
cp "$BUILD_BINARY" "$APP_BUNDLE/Contents/MacOS/$APP_NAME"
cat > "$APP_BUNDLE/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>BUS311MissionControl</string>
<key>CFBundleIdentifier</key><string>edu.endicott.bus311.mission-control</string>
<key>CFBundleName</key><string>BUS311 Mission Control</string>
<key>CFBundleIconFile</key><string>BUS311MissionControl.icns</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>0.2</string>
<key>CFBundleVersion</key><string>2</string>
<key>LSMinimumSystemVersion</key><string>14.0</string>
<key>NSPrincipalClass</key><string>NSApplication</string>
</dict></plist>
PLIST
xattr -cr "$APP_BUNDLE"
codesign --force --sign - "$APP_BUNDLE"
if [[ "${BUS311_INSTALL_DESKTOP:-0}" == "1" ]]; then
    DESKTOP_APP="$HOME/Desktop/BUS311 Mission Control.app"
    ditto "$APP_BUNDLE" "$DESKTOP_APP"
    xattr -cr "$DESKTOP_APP"
    codesign --force --sign - "$DESKTOP_APP"
    APP_BUNDLE="$DESKTOP_APP"
fi
if [[ "$MODE" == "--debug" ]]; then
    exec lldb -- "$APP_BUNDLE/Contents/MacOS/$APP_NAME"
fi
codesign --verify --strict "$APP_BUNDLE"
open -n "$APP_BUNDLE"
case "$MODE" in
    --verify) sleep 2; pgrep -x "$APP_NAME" ;;
    --logs) /usr/bin/log stream --info --style compact --predicate 'process == "BUS311MissionControl"' ;;
    --telemetry) /usr/bin/log stream --info --style compact --predicate 'subsystem == "edu.endicott.bus311.mission-control"' ;;
esac
