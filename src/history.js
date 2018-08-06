
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import process from 'process';

const getHistory = () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    console.log('browser history', process.env.NODE_ENV);
    return createBrowserHistory();
  }

  // Packaged app confuses assets for page routes. This fixes it. Ulimately a better
  // configured webpack would probably be the best solution
  console.log('memory history', process.env.NODE_ENV);
  return createMemoryHistory();
};

const history = getHistory();

export default history;
