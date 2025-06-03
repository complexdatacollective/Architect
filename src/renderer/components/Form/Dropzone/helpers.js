const getExtension = (path) => {
  const match = /(.[A-Za-z0-9]+)$/.exec(path);
  if (!match) { return null; }
  return match[1];
};

const matchExtension = (path, extension) => RegExp(`${extension}$`).test(path.toLowerCase());

const acceptsPath = (accepts) => (path) => accepts.some((accept) => matchExtension(path, accept));

export const acceptsPaths = (accepts, paths) => {
  if (!paths || paths.length === 0) { return false; }
  return paths.every(acceptsPath(accepts));
};

export const getRejectedExtensions = (accepts, paths) => paths.reduce((memo, path) => {
  if (acceptsPath(accepts)(path)) { return memo; }
  const extension = getExtension(path);
  if (memo.includes(extension)) { return memo; }
  return [...memo, extension];
}, []);

export const getAcceptsExtensions = (accepts) => accepts.map((accept) => accept.substr(1));
