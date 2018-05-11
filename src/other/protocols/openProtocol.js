import path from 'path';
import { extract } from '../../other/archive';

const openProtocol = fileName =>
  new Promise((resolve) => {
    if (path.extname(fileName) === '.netcanvas') {
      extract(fileName)
        .then((workingPath) => {
          resolve({
            archivePath: fileName,
            workingPath,
          });
        });
    } else {
      resolve({
        workingPath: path.dirname(fileName),
        advanced: true,
      });
    }
  });

export default openProtocol;
