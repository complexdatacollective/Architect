import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, change } from 'redux-form';
import { get, find } from 'lodash';
import { compose, withHandlers } from 'recompose';
import SkipLogicEditor, { formName } from './SkipLogicEditor';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';

const defaultLogic = {
  action: 'SKIP',
  filter: {
    join: 'AND',
    rules: [],
  },
};

const mapInitialValues = (state, props) => {
  const stageId = props.id;
  const protocol = getProtocol(state);
  const stage = find(protocol.stages, ['id', stageId]);
  const initialValues = get(stage, 'skipLogic', defaultLogic);

  return {
    initialValues,
  };
};

const mapFormState = (state) => {
  const logic = getFormValues(formName)(state) || defaultLogic;
  return {
    logic,
  };
};

const mapChangeActions = dispatch => ({
  changeForm: bindActionCreators(change, dispatch),
});

const changeHandlers = withHandlers({
  onChange: ({ changeForm }) =>
    (field, logic) => changeForm(formName, field, logic),
});

// Shim form to work with our non-redux-form component
const withFormAdapter = compose(
  connect(mapFormState, mapChangeActions),
  changeHandlers,
);

const withInitialValues = connect(mapInitialValues);

const mapStageActions = dispatch => ({
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
});

const submitHandlers = withHandlers({
  onSubmit: ({ id, updateStage, logic, onComplete }) =>
    () => {
      const stageId = id;
      updateStage(
        stageId,
        {
          skipLogic: {
            action: logic.action,
            filter: logic.filter,
          },
        },
      );

      onComplete();
    },
});

const withSubmit = compose(
  connect(null, mapStageActions),
  submitHandlers,
);

export { formName };

export default compose(
  withFormAdapter,
  withSubmit,
  withInitialValues,
  reduxForm({ form: formName }),
)(SkipLogicEditor);
