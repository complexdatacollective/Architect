import React from 'react';
import Dialog from './Dialog';

const Confirm = ({ title, text, onConfirm, onCancel, show }) => (
  <Dialog
    type="confirm"
    title={`CONFIRM: ${title}`}
    show={show}
    options={[
      <button key="confirm" onClick={onConfirm}>OK</button>,
      <button key="cancel" onClick={onCancel}>CANCEL</button>,
    ]}
    onBlur={onCancel}
  >
    {text}
  </Dialog>
);

export { Confirm };

export default Confirm;
