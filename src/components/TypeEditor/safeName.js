const safeName = name =>
  name.replace(/[^a-zA-Z0-9_-]+/g, '');

export default safeName;
