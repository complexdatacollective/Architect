const fs = require('fs-extra');
const path = require('path');

const originalPath = path.join('network-canvas', 'www');
const appPath = path.join('app', 'network-canvas');

fs.rename(originalPath, appPath);
