import { connect } from 'react-redux';
import {
  getVariablesForNodeType,
  getLayoutVariablesForNodeType,
} from './selectors';

const withOptions = (state, props) => {
  const variablesForNodeType = getVariablesForNodeType(state, props);
  const layoutVariablesForNodeType = getLayoutVariablesForNodeType(state, props);

  return {
    variablesForNodeType,
    layoutVariablesForNodeType,
  };
};

export { withOptions };

export default connect(withOptions);
