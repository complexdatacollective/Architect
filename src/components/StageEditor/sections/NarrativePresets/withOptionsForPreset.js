import { connect } from 'react-redux';
import {
  getLayoutVariablesForNodeType,
  getHighlightVariablesForNodeType,
  getGroupVariablesForNodeType,
  getEdgesForNodeType,
} from './selectors';


const mapStateToProps = (state, { nodeType }) => {
  const layoutVariblesForNodeType = getLayoutVariablesForNodeType(state, nodeType);
  const highlightVariablesForNodeType = getHighlightVariablesForNodeType(state, nodeType);
  const groupVariablesForNodeType = getGroupVariablesForNodeType(state, nodeType);
  const edgesForNodeType = getEdgesForNodeType(state, nodeType);

  return {
    layoutVariblesForNodeType,
    highlightVariablesForNodeType,
    groupVariablesForNodeType,
    edgesForNodeType,
  };
};

const withOptionsForPreset = connect(mapStateToProps);

export default withOptionsForPreset;
