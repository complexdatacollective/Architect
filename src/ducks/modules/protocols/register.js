import uuid from 'uuid';
import path from 'path';

const REGISTER_PROTOCOL = 'PROTOCOLS/REGISTER';

const isNetcanvasFile = fileName =>
  path.extname(fileName) === '.netcanvas';

const registerProtocol = ({ filePath, workingPath }) => ({
  type: REGISTER_PROTOCOL,
  filePath,
  id: uuid(),
  advanced: !isNetcanvasFile(filePath),
  workingPath,
});

const actionCreators = {
  registerProtocol,
};

const actionTypes = {
  REGISTER_PROTOCOL,
};

export {
  actionCreators,
  actionTypes,
};

