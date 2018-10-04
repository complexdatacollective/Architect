import React from 'react';
import Dialog from './Dialog';

const Notice = ({ title, text, onConfirm, show }) => (
  <Dialog
    type="notice"
    title={`NOTICE: ${title}`}
    show={show}
    options={[<button key="confirm" onClick={onConfirm}>OK</button>]}
    onBlur={onConfirm}
  >
    {text}
  </Dialog>
);

export { Notice };

export default Notice;
