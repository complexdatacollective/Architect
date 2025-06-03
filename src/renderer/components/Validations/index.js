import { withState, compose } from 'recompose';
import Validations from './Validations';
import withStoreState from './withStoreState';
import withUpdateHandlers from './withUpdateHandlers';

const withAddNew = withState('addNew', 'setAddNew', false);

export default compose(
  withStoreState,
  withAddNew,
  withUpdateHandlers,
)(Validations);
