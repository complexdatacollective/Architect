import fs from 'fs';
import decompress from 'decompress';
import archiver from 'archiver';

const archiveOptions = {
  // zlib: { level: 9 },
  store: true,
};

const extract = (sourcePath, destinationPath) =>
  decompress(
    sourcePath,
    destinationPath,
  ).then(() => destinationPath);

const archive = (sourcePath, destinationPath) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destinationPath);
    const zip = archiver('zip', archiveOptions);

    output.on('close', () => {
      resolve(sourcePath, destinationPath);
    });

    output.on('warning', reject);
    output.on('error', reject);

    zip.pipe(output);

    zip.on('warning', reject);
    zip.on('error', reject);

    zip.directory(sourcePath, false);

    zip.finalize();
  });

export {
  extract,
  archive,
};
