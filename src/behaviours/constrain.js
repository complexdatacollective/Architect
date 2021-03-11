import { withContext } from 'recompose';
import PropTypes from 'prop-types';

const constrain = (constraints) => withContext(
  { constraints: PropTypes.array },
  () => ({ constraints }),
);

export default constrain;
