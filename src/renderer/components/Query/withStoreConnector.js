import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCodebook } from '../../selectors/protocol';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

const mapStateToProps = (state) => ({
  codebook: getCodebook(state),
});

const mapDispatchToProps = (dispatch) => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

const withStoreConnector = connect(mapStateToProps, mapDispatchToProps);

export default withStoreConnector;
