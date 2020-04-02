import { CellMeasurerCache } from 'react-virtualized';

const DEFAULT_ROW_HEIGHT = 50;

// In this example, average cell width is assumed to be about 100px.
// This value will be used for the initial `Grid` layout.
// Cell measurements smaller than 75px should also be rounded up.
// Height is not dynamic.
const cache = new CellMeasurerCache({
  // defaultHeight: DEFAULT_ROW_HEIGHT,
  minHeight: DEFAULT_ROW_HEIGHT,
  fixedWidth: true,
});

export default cache;
