import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { omit } from 'lodash';
import prune from '@app/utils/prune';
import { actionCreators as stageActions } from '@modules/protocol/stages';

const mapDispatchToProps = {
  updateStage: stageActions.updateStage,
  updatePath: stageActions.updatePath,
  resetPaths: stageActions.resetPaths,
  createStage: stageActions.createStage,
};

const stageEditorHanders = withHandlers({
  onSubmit: ({ id, insertAtIndex, updateStage, createStage, onComplete }) =>
    (stage) => {
      const normalizedStage = omit(prune(stage), '_modified');

      if (id) {
        updateStage(id, normalizedStage);
      } else {
        createStage(normalizedStage, insertAtIndex);
      }

      onComplete();
    },
  onChange: ({ id, updatePath }) =>
    (path, value) => updatePath(id, path, value),
  onReset: ({ id, resetPaths }) =>
    (keys, keep) =>
      resetPaths(id, keys, keep),
});

const withStageEditorHandlers = compose(
  connect(null, mapDispatchToProps),
  stageEditorHanders,
);

export default withStageEditorHandlers;
