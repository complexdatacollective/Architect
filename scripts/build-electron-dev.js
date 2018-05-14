const fs = require('fs-extra');
const paths = require('../config/paths');

const mainSrc = paths.appPublic;

function copySrc() {
  fs.emptyDirSync(paths.electronDev);

  fs.copySync(mainSrc, paths.electronDev, {
    filter: file => !(/__tests__/).test(file),
  });

  fs.copySync(paths.appPublic, paths.electronDev, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

copySrc();
