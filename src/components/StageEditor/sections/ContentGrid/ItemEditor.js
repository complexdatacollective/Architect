import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field } from 'redux-form';

const getInput = (name, item) =>
  <Field name={name} />;

const VariableEditor = ({ name, item, show }) => (
  <div className={cx('content-grid-editor', { 'content-grid-editor--show': show })}>
    {getInput(name, item)}
  </div>
);

VariableEditor.propTypes = {
  item: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  show: PropTypes.bool,
};

VariableEditor.defaultProps = {
  show: false,
};

export default VariableEditor;
