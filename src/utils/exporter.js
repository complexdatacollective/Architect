import { remote } from 'electron';
import fs from 'fs';
import Zip from 'jszip';

const options = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save as:',
};

const saveDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog(options, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename);
    });
  });

const writeFile = (filename, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filename, content, (err) => {
      if (err) { reject(err); }
      resolve();
    });
  });

// FIXME: Could actually pass in zip instance?
const exporter = () => {
  const zip = new Zip();

  // TODO: Add data to the export here.
  zip.file('Hello.txt', 'Hello World\n');
  // const img = zip.folder("images");
  // img.file("smile.gif", imgData, {base64: true});

  return Promise.all([
    saveDialog(),
    zip.generateAsync({ type: 'blob' }),
  ]).then(([ filename, content ]) =>
    writeFile(filename, content)
  );
};

export default exporter;
