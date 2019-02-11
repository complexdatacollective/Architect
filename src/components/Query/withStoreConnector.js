import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    variableRegistry: protocol.variableRegistry,
  };
};

const mapDispatchToProps = dispatch => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});


const withStoreConnector = connect(mapStateToProps, mapDispatchToProps);

export default withStoreConnector;
