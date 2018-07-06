import createLogger from 'redux-logger';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  logger: console,
  predicate: (getState, action) => !/^@@redux-form/.test(String(action.type)),
});

export default logger;
