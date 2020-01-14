import React from 'react';
import PropTypes from 'prop-types';
import Window from './Window';
import Form from './Form';

const FormWindow = ({
  show,
  form,
  flipId,
  onSubmit,
  onCancel,
  children,
  index,
  ...rest
}) => (
  <Window show={show} index={index}>
    <Form
      flipId={flipId}
      onSubmit={onSubmit}
      onCancel={onCancel}
      form={form}
      {...rest}
    >
      {children}
    </Form>
  </Window>
);

FormWindow.propTypes = {
  show: PropTypes.bool,
  form: PropTypes.string.isRequired,
  flipId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  children: PropTypes.node,
};

FormWindow.defaultProps = {
  show: false,
  flipId: null,
  children: null,
};

export default FormWindow;

