import { connect } from 'react-redux';
import { change } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { actionCreators as screenActions } from '@modules/ui/screens';
import { makeScreenMessageListener } from '@selectors/ui';

const mapStateToProps = () => {
  const screenMessageListener = makeScreenMessageListener('type');

  return state => ({
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
  handleTypeScreenMessage: ({ changeForm, form, name, format }) =>
    (message) => {
      if (!message) { return; }

      const { type } = message;
      const value = format(type);
      changeForm(form, name, value);
    },
  handleOpenCreateNewType: ({ openScreen }) =>
    () => {
      openScreen('type', { entity: 'edge' });
    },
});

const withCreateNewType = compose(
  createTypeState,
  createTypeHandlers,
);

export default withCreateNewType;
