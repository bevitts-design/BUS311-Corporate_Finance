#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="$ROOT_DIR/MissionControl/Assets/AppIcon.svg"
OUTPUT="${1:?output .icns path required}"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/bus311-icon.XXXXXX")"
trap 'rm -rf "$WORK_DIR"' EXIT

/usr/bin/qlmanage -t -s 1024 -o "$WORK_DIR" "$SOURCE" >/dev/null 2>&1
MASTER="$WORK_DIR/AppIcon.svg.png"
ICONSET="$WORK_DIR/AppIcon.iconset"
mkdir -p "$ICONSET" "$(dirname "$OUTPUT")"
for entry in '16 icon_16x16.png' '32 icon_16x16@2x.png' '32 icon_32x32.png' '64 icon_32x32@2x.png' '128 icon_128x128.png' '256 icon_128x128@2x.png' '256 icon_256x256.png' '512 icon_256x256@2x.png' '512 icon_512x512.png' '1024 icon_512x512@2x.png'; do
  set -- $entry
  /usr/bin/sips -z "$1" "$1" "$MASTER" --out "$ICONSET/$2" >/dev/null
done
/usr/bin/iconutil -c icns "$ICONSET" -o "$OUTPUT"
