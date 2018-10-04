import React, { Component } from 'react';
import uuid from 'uuid';
import * as Dialogs from './Dialog';

class DialogManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogs: [
        {
          id: uuid(),
          type: 'Warning',
          title: 'Warning!',
          text: 'Something happened',
          confirm: () => { console.log('confirm warning'); },
        },
        {
          id: uuid(),
          type: 'Confirm',
          title: 'Do you want to confirm the thing?',
          text: 'We might have more details here',
          confirm: () => { console.log('confirm confirm'); },
          cancel: () => { console.log('cancel confirm'); },
        },
        {
          id: uuid(),
          type: 'Notice',
          title: 'Hi',
          text: 'Notice me',
          confirm: () => { console.log('confirm notice'); },
        },
      ],
    };
  }

  get dialogs() {
    return this.state.dialogs;
  }

  get activeDialog() {
    if (this.state.dialogs.length === 0) { return null; }
    return this.state.dialogs[this.state.dialogs.length - 1];
  }

  dismissDialog(id) {
    this.setState({
      dialogs: this.state.dialogs.filter(dialog => dialog.id !== id),
    });
  }

  handleConfirm = (dialog) => {
    if (dialog.confirm) { dialog.confirm(dialog); }
    this.dismissDialog(dialog.id);
  }

  handleCancel = (dialog) => {
    if (dialog.cancel) { dialog.cancel(dialog); }
    this.dismissDialog(dialog.id);
  }

  renderDialog = (dialog) => {
    const Dialog = Dialogs[dialog.type];
    const { confirm, cancel, dialogProps } = dialog;

    return (
      <Dialog
        show
        key={dialog.id}
        onConfirm={() => this.handleConfirm(dialog)}
        onCancel={() => this.handleCancel(dialog)}
        {...dialog}
      />
    );
  }

  render() {
    if (!this.activeDialog) { return null; }


    return this.dialogs.map(this.renderDialog);
  }
}

export { DialogManager };

export default DialogManager;
