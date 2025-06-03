import createLogger from 'redux-logger';

// eslint-disable-next-line no-console
// console.warn('/^@@redux-form/ and /^GUIDANCE/ actions are hidden in logger');

const logger = createLogger({
  level: 'info',
  collapsed: true,
  logger: console,
  // predicate: (getState, action) => (
  //   !/^@@redux-form/.test(String(action.type))
  //   && !/^GUIDANCE/.test(String(action.type))
  // ),
});

export default logger;
