import { compose } from 'recompose';
import EdgeTypeFields from './EdgeTypeFields';
import withDefaults from './withDefaults';
import withDisableAndReset from './withDisableAndReset';
import withCreateNewType from './withCreateEdgeType';
import withEdgeTypeOptions from './withEdgeTypeOptions';

export default compose(
  withDefaults,
  withEdgeTypeOptions,
  withDisableAndReset,
  withCreateNewType,
)(EdgeTypeFields);

export const EdgeTypeFieldsNoReset = compose(
  withDefaults,
  withEdgeTypeOptions,
  withCreateNewType,
)(EdgeTypeFields);
