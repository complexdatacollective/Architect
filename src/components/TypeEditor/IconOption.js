import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@codaco/ui/lib/components/Icon';
import Radio from '../Form/Fields/Radio';

const IconOption = (props) => (
  <Radio
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className="type-editor-icon-option"
    // eslint-disable-next-line react/destructuring-assignment
    label={<Icon name={props.label} />}
  />
);

IconOption.propTypes = {
  label: PropTypes.string.isRequired,
};

export default IconOption;
