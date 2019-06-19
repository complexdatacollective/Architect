// npm run bump x.x.1

if (process.argv.length <= 1) {
  console.log('Specify a version format "x.x.n codename (optional)"');
  console.log('for example:');
  console.log('  `npm run bump x.x.1 Hercules`');
  process.exit();
}

const fs = require('fs-extra');

const userVersion = process.argv[2];
const userCodename = process.argv[3] || '';
const currentVersion = fs.readJsonSync('./package.json').version;

const getNewVersion = (version, versionMask) => {
  const versionMaskParts = versionMask.split('.');

  return version.split('.')
    .map((value, index) => {
      if (versionMaskParts[index] === 'x') { return value; }
      return versionMaskParts[index];
    }).join('.');
};

const updatePackageVersion = (file, version) => {
  const packageJson = fs.readJsonSync(file);

  fs.writeJsonSync(file, {
    ...packageJson,
    version,
  }, { spaces: 4 });
};

const newVersion = getNewVersion(currentVersion, userVersion);

console.log('new version', newVersion, userCodename);

updatePackageVersion('./package.json', newVersion);
updatePackageVersion('./package-lock.json', newVersion);
updatePackageVersion('./public/package.json', newVersion);

if (userCodename.length > 0) {
  const codenameObj = fs.readJsonSync('./src/codenames.json');
  fs.writeJsonSync('./src/codenames.json', {
    ...codenameObj,
    [newVersion]: userCodename,
  }, { spaces: 2 });
}
