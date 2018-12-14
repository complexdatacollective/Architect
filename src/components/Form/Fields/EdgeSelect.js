import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import EdgeIcon from '../../EdgeIcon';
import * as Fields from '../../../ui/components/Fields';

const PreviewEdge = ({ label, color, input: { value, checked, onChange } }) => (
  <div
    className={cx('preview-edge', { 'preview-edge--selected': checked })}
    onClick={() => onChange(value)}
  >
    <div className="preview-edge__background" />
    <EdgeIcon color={`var(--${color})`} />
    {label}
  </div>
);

PreviewEdge.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

PreviewEdge.defaultProps = {
  color: 'edge-color-seq-1',
};

const EdgeSelect = ({ className, ...rest }) => (
  <Fields.RadioGroup
    optionComponent={PreviewEdge}
    className={cx('form-fields-edge-select', className)}
    {...rest}
  />
);

EdgeSelect.propTypes = {
  className: PropTypes.string,
};

EdgeSelect.defaultProps = {
  className: '',
};

export default EdgeSelect;
