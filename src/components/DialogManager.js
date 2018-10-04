import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { omit } from 'lodash';
import * as Dialogs from './Dialog';
import { actionCreators as dialogsActions } from '../ducks/modules/dialogs';

class DialogManager extends Component {
  get dialogs() {
    return this.props.dialogs;
  }

  handleConfirm = (dialog) => {
    if (dialog.confirm) { dialog.confirm(dialog); }
    this.props.closeDialog(dialog.id);
  }

  handleCancel = (dialog) => {
    if (dialog.cancel) { dialog.cancel(dialog); }
    this.props.closeDialog(dialog.id);
  }

  renderDialog = (dialog) => {
    const Dialog = Dialogs[dialog.type];

    return (
      <Dialog
        show
        key={dialog.id}
        onConfirm={() => this.handleConfirm(dialog)}
        onCancel={() => this.handleCancel(dialog)}
        {...omit(dialog, ['confirm', 'cancel'])}
      />
    );
  }

  render() {
    return this.dialogs.map(this.renderDialog);
  }
}

const mapStateToProps = state => ({
  dialogs: state.dialogs.dialogs,
});

const mapDispatchToProps = dispatch => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
  closeDialog: bindActionCreators(dialogsActions.closeDialog, dispatch),
});

export { DialogManager };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DialogManager);
