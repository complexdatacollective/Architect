import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@codaco/ui/lib/components/Modal';

/*
 *  <ExampleForm
 *    show={formOpen}
 *    onComplete={() => {
 *      // Form specific callback, probably also changes state of formOpen
 *      closeForm();
 *    }}
 *  />
 */

const ExampleForm = ({ show, onComplete, onBlur }) => (
  <Modal show={show} onBlur={onBlur}>
    <div style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
      Name:
      <input type="text" />
      <button type="button" onClick={onComplete}>Confirm</button>
    </div>
  </Modal>
);

ExampleForm.propTypes = {
  show: PropTypes.bool,
  onBlur: PropTypes.func,
  onComplete: PropTypes.func,
};

ExampleForm.defaultProps = {
  show: false,
  onBlur: () => {},
  onComplete: () => {},
};

export { ExampleForm };

export default ExampleForm;
