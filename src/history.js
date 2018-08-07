
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import process from 'process';

const getHistory = () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    return createBrowserHistory();
  }

  // Packaged app confuses assets for page routes. This fixes it. Ulimately a better
  // configured webpack would probably be the best solution
  return createMemoryHistory();
};

const history = getHistory();

export default history;
