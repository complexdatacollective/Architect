import { connect } from 'react-redux';
import {
  getLayoutVariablesForSubject,
  getHighlightVariablesForSubject,
  getGroupVariablesForSubject,
  getEdgesForSubject,
} from './selectors';


const mapStateToProps = (state, { entity, type }) => {
  const layoutVariblesForSubject = getLayoutVariablesForSubject(state, { entity, type });
  const highlightVariablesForSubject = getHighlightVariablesForSubject(state, { entity, type });
  const groupVariablesForSubject = getGroupVariablesForSubject(state, { entity, type });
  const edgesForSubject = getEdgesForSubject(state, { entity, type });

  return {
    layoutVariblesForSubject,
    highlightVariablesForSubject,
    groupVariablesForSubject,
    edgesForSubject,
  };
};

const withOptionsForPreset = connect(mapStateToProps);

export default withOptionsForPreset;
