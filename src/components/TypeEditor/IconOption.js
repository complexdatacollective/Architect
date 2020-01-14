import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@codaco/ui/lib/components/Icon';
import Radio from '@codaco/ui/lib/components/Fields/Radio';

const IconOption = props => (
  <Radio
    {...props}
    className="type-editor-icon-option"
    label={<Icon name={props.label} />}
  />
);

IconOption.propTypes = {
  label: PropTypes.string.isRequired,
};

export default IconOption;
