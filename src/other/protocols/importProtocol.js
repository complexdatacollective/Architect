import path from 'path';
import { extract } from './archive';

const importProtocol = filePath =>
  new Promise((resolve) => {
    if (path.extname(filePath) === '.netcanvas') {
      extract(filePath).then(resolve);
    } else {
      // TODO: should copy then return working path
      resolve(filePath);
    }
  });

export default importProtocol;
