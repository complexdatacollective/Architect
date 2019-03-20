import { connect } from 'react-redux';
import {
  getVariablesForNodeType,
  getLayoutVariablesForNodeType,
  getHighlightVariablesForNodeType,
  getEdgesForNodeType,
} from './selectors';

const withOptions = (state, props) => {
  const variablesForNodeType = getVariablesForNodeType(state, props);
  const layoutVariablesForNodeType = getLayoutVariablesForNodeType(state, props);
  const highlightVariablesForNodeType = getHighlightVariablesForNodeType(state, props);
  const edgesForNodeType = getEdgesForNodeType(state, props);

  return {
    variablesForNodeType,
    layoutVariablesForNodeType,
    highlightVariablesForNodeType,
    edgesForNodeType,
  };
};

export { withOptions };

export default connect(withOptions);
