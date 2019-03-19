import { connect } from 'react-redux';
import {
  getLayoutVariablesForNodeType,
  getHighlightVariablesForNodeType,
  getGroupVariablesForNodeType,
  getEdgesForNodeType,
} from './selectors';


const mapStateToProps = (state, props) => {
  const layoutVariblesForNodeType = getLayoutVariablesForNodeType(state, props);
  const highlightVariablesForNodeType = getHighlightVariablesForNodeType(state, props);
  const groupVariablesForNodeType = getGroupVariablesForNodeType(state, props);
  const edgesForNodeType = getEdgesForNodeType(state, props);

  return {
    layoutVariblesForNodeType,
    highlightVariablesForNodeType,
    groupVariablesForNodeType,
    edgesForNodeType,
  };
};

const withOptionsForPreset = connect(mapStateToProps);

export default withOptionsForPreset;
