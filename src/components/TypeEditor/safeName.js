const safeName = name =>
  name.replace(/[^a-zA-Z0-9]+/g, '');

export default safeName;
