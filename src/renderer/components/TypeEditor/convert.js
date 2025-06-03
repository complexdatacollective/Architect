// convert protocol format into redux-form compatible format
const format = (configuration) => ({
  ...configuration,
});

// convert redux-form format into protocol format
const parse = (configuration) => ({
  ...configuration,
});

export {
  format,
  parse,
};
