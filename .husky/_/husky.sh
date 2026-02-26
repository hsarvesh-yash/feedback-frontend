#!/usr/bin/env sh
# Minimal husky helper shim for portability in this repo. This is a lightweight
# shim that emulates the behavior of the real husky.sh used at install time.
# When `npm run prepare` runs, real husky will overwrite this.
command_exists() { command -v "$1" >/dev/null 2>&1; }
if [ -z "$HUSKY_SKIP_INSTALL" ]; then
  if command_exists git; then
    true
  fi
fi
