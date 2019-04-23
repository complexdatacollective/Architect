import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actionCreators as uiActions } from '../../ducks/modules/ui';

const mapStateToProps = state => ({
  locus: state.protocol.timeline[state.protocol.timeline.length - 1],
});

const mapDispatchToProps = {
  closeScreen: uiActions.closeScreen,
  openScreen: uiActions.openScreen,
};

const createNewHandlers = withHandlers({
  handleCreateNew: ({ openScreen, closeScreen, insertAtIndex, locus }) =>
    (type) => {
      closeScreen('newStage');
      // TODO: must also supply locus!!!
      openScreen('stage', { type, locus, insertAtIndex });
    },
});

const withCreateNewStage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createNewHandlers,
);

export default withCreateNewStage;
