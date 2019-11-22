import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get, find } from 'lodash';
import { compose, withProps, withHandlers } from 'recompose';
import Editor from '@components/Editor';
import { getProtocol } from '@selectors/protocol';
import { actionCreators as stageActions } from '@modules/protocol/stages';
import SkipLogicFields from './SkipLogicFields';

const formName = 'skip-logic';

const defaultLogic = {
  action: 'SKIP',
  filter: {
    join: null,
    rules: [],
  },
};

const withStore = connect(
  (state, props) => {
    const stageId = props.id;
    const protocol = getProtocol(state);
    const stage = find(protocol.stages, ['id', stageId]);
    const initialValues = get(stage, 'skipLogic', defaultLogic);

    return {
      initialValues,
    };
  },
  dispatch => ({
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  }),
);

const withSubmitHandler = withHandlers({
  onSubmit: ({ id, updateStage, onComplete }) =>
    (skipLogic) => {
      const stageId = id;

      updateStage(
        stageId,
        {
          skipLogic,
        },
      );

      onComplete();
    },
});

export { formName };

export default compose(
  withStore,
  withSubmitHandler,
  withProps(() => ({
    form: formName,
    component: SkipLogicFields,
  })),
)(Editor);
