// npm run bump x.x.1

if (process.argv.length <= 2) {
  console.log('Specify a version format "x.x.n codename"');
  console.log('for example:');
  console.log('  `npm run bump x.x.1 Hercules`');
  process.exit();
}

const fs = require('fs-extra');

const packageObj = fs.readJsonSync('./package.json');
const codenameObj = fs.readJsonSync('./src/codenames.json');

const versionMask = process.argv[2].split('.');
const codename = process.argv[3];
const currentVersion = packageObj.version.split('.');

const newVersion = currentVersion.map((value, index) => {
  if (versionMask[index] === 'x') { return value; }
  return versionMask[index];
}).join('.');

console.log('new version', newVersion, codename);

fs.writeJsonSync('./package.json', {
  ...packageObj,
  version: newVersion,
}, { spaces: 4 });

fs.writeJsonSync('./src/codenames.json', {
  ...codenameObj,
  [newVersion]: codename,
}, { spaces: 2 });
