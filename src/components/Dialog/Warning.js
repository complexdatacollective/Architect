import React from 'react';
import Dialog from './Dialog';

const Warning = ({ title, text, onConfirm, show }) => (
  <Dialog
    type="warning"
    title={`WARNING: ${title}`}
    show={show}
    options={[<button key="confirm" onClick={onConfirm}>OK</button>]}
    onBlur={onConfirm}
  >
    {text}
  </Dialog>
);

export { Warning };

export default Warning;
