import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../ui/components/Icon';
import Radio from '../../ui/components/Fields/Radio';

const IconOption = props => (
  <Radio
    {...props}
    label={<Icon name={props.label} />}
  />
);

IconOption.propTypes = {
  label: PropTypes.string.isRequired,
};

export default IconOption;
