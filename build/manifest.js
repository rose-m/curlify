#!/usr/bin/env node

const fs = require('fs');

if (process.argv.length < 3) {
    throw new Error('missing platform')
}

const platform = process.argv[2];
const platformJson = `manifest.${platform}.json`;

if (!fs.existsSync('manifest.base.json')) {
    throw new Error('missing manifest.base.json');
}

if (!fs.existsSync(platformJson)) {
    throw new Error(`missing ${platformJson}`);
}
