
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import process from 'process';

const getHistory = () => {
  if (process.env.NODE_ENV === 'development') {
    return createHistory();
  }

  // Packaged app confuses assets for page routes. This fixes it. Ulimately a better
  // configured webpack would probably be the best solution
  return createMemoryHistory();
};

const history = getHistory();

export default history;
