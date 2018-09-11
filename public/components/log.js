const electron = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');

const userDataPath = (electron.app || electron.remote.app).getPath('userData');

log.transports.console.level = false;
log.transports.file.level = 'log';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';
log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.file.streamConfig = { flags: 'w+' };
log.transports.file.stream = fs.createWriteStream(path.join(userDataPath, 'debug.log'));

console.log('logs stored in:');
console.log(path.join(userDataPath, 'debug.log'));

module.exports = log;
