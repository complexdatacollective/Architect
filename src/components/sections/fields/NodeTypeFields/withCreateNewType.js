import { connect } from 'react-redux';
import { change } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { actionCreators as screenActions } from '@modules/ui/screens';
import { makeScreenMessageListener } from '@selectors/ui';

const mapStateToProps = () => {
  const screenMessageListener = makeScreenMessageListener('type');

  return (state) => ({
    typeScreenMessage: screenMessageListener(state),
  });
};

const createTypeState = connect(
  mapStateToProps,
  {
    openScreen: screenActions.openScreen,
    changeForm: change,
  },
);

const createTypeHandlers = withHandlers({
  // If there is no stage subject, switch to it.
  // If there *is* a stage subject, just create the new type.
  handleTypeScreenMessage: ({
    changeForm,
    form,
    type: currentType,
  }) => (message) => {
    // Message is sent by the new entity screen dialog.
    // If it is empty, we don't need to do anything.
    // If there is a currentType, we also don't do anything
    if (!message || currentType) { return; }

    // If there's no currentType, change the form to the new type.
    const { entity, type } = message;
    changeForm(form, 'subject', { entity, type });
  },
  handleOpenCreateNewType: ({ openScreen }) => () => {
    openScreen('type', { entity: 'node' });
  },
});

const withCreateNewType = compose(
  createTypeState,
  createTypeHandlers,
);

export default withCreateNewType;
