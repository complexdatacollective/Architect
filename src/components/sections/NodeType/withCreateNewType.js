import { connect } from 'react-redux';
import { change } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { actionCreators as uiAction, onUIMessage } from '../../../ducks/modules/ui';

const createTypeState = connect(
  state => ({
    ui: state.ui.message,
  }),
  {
    openScreen: uiAction.openScreen,
    changeForm: change,
  },
);

// componentDidUpdate({ ui: prevMessage }) {
//   const message = this.props.ui;
//   onUIMessage(message, prevMessage, 'variable', this.handleNewVariableMessage);
// }

const createTypeHandlers = withHandlers({
  handleUIMessage: ({ ui: message, changeForm, form }) =>
    (prevMessage) => {
      const handleTypeMessage = (nodeType) => {
        changeForm(form, 'nodeType', nodeType);
      };

      onUIMessage(message, prevMessage, 'variable', handleTypeMessage);
    },
  handleOpenCreateNewType: ({ openScreen }) =>
    () => {
      openScreen('type', { category: 'node' });
    },
});

const withCreateNewType = compose(
  createTypeState,
  createTypeHandlers,
);

export default withCreateNewType;
