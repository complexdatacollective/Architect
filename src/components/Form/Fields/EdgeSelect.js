import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import * as Fields from '@codaco/ui/lib/components/Fields';

const PreviewEdge = ({ label, color, input: { value, checked, onChange } }) => (
  <div
    className={cx('preview-edge', { 'preview-edge--selected': checked })}
    style={{ '--edge-color': `var(--${color})` }}
    onClick={() => onChange(value)}
  >
    <Icon name="links" color={color} />
    {label}
  </div>
);

PreviewEdge.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
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
