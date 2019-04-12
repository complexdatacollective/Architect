import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import withSubject from '../../enhancers/withSubject';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import { getTypeForComponent } from '../../Form/inputOptions';
import { getCodebookProperties } from './helpers';

const fieldChangeHandlers = withHandlers({
  handleChangeFields: ({ updateVariable, type, entity }) =>
    ({ variable, component, ...rest }) => {
      const variableType = getTypeForComponent(component);
      const codebookProperties = getCodebookProperties(rest);
      const configuration = { type: variableType, ...codebookProperties };

      updateVariable(
        entity,
        type,
        variable,
        configuration,
      );
    },
});

const mapDispatchToProps = {
  updateVariable: codebookActions.updateVariable,
};

const withFieldChangeHandlers = compose(
  withSubject,
  connect(null, mapDispatchToProps),
  fieldChangeHandlers,
);

export default withFieldChangeHandlers;
