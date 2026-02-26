#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const semver = (v) => v.split('.').map((n) => parseInt(n, 10));
const toVersion = (parts) => parts.join('.');

const kind = process.argv[2];
if (!kind || !['major', 'minor', 'patch'].includes(kind)) {
  console.error('Usage: bump-version.js <major|minor|patch>');
  process.exit(1);
}

const parts = semver(pkg.version || '0.0.0');
if (kind === 'major') {
  parts[0] = (parts[0] || 0) + 1;
  parts[1] = 0;
  parts[2] = 0;
} else if (kind === 'minor') {
  parts[1] = (parts[1] || 0) + 1;
  parts[2] = 0;
} else {
  parts[2] = (parts[2] || 0) + 1;
}

const newVersion = toVersion(parts.map((n) => n.toString()));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Bumped version to ${newVersion}`);
process.exit(0);
