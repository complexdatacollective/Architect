import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field } from 'redux-form';

const getInput = (name, type) =>
  <Field name={name} />;

const VariableEditor = ({ name, type, show }) => (
  <div className={cx('content-grid-editor', { 'content-grid-editor--show': show })}>
    {getInput(name, type)}
  </div>
);

VariableEditor.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  show: PropTypes.bool,
};

VariableEditor.defaultProps = {
  show: false,
};

export default VariableEditor;
