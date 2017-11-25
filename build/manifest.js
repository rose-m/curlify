#!/usr/bin/env node

const fs = require('fs');

const platform = process.argv.length >= 3 ? process.argv[2] : process.env.CURLIFY_PLATFORM;
if (!platform) {
    throw new Error('missing platform');
}

const platformJson = `manifest.${platform}.json`;

if (!fs.existsSync('manifest.base.json')) {
    throw new Error('missing manifest.base.json');
}

if (!fs.existsSync(platformJson)) {
    throw new Error(`missing ${platformJson}`);
}

const baseData = JSON.parse(fs.readFileSync('manifest.base.json', { encoding: 'UTF-8' }));
const platformData = JSON.parse(fs.readFileSync(platformJson, { encoding: 'UTF-8' }));

const resultData = Object.assign({}, baseData, platformData);
fs.writeFileSync('manifest.json', JSON.stringify(resultData), { encoding: 'UTF-8' });
