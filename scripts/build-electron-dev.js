const fs = require('fs-extra');
const paths = require('../config/paths');

function copySrc() {
  fs.emptyDirSync(paths.electronDev);

  fs.copySync(paths.appPublic, paths.electronDev, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

copySrc();
