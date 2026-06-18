import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';
import { getCodebook } from '../../selectors/protocol';

const mapStateToProps = (state) => ({
  codebook: getCodebook(state),
});

const mapDispatchToProps = (dispatch) => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

const withStoreConnector = connect(mapStateToProps, mapDispatchToProps);

export default withStoreConnector;
