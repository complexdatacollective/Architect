import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '@codaco/ui/lib/components/ActionButton';
import Radio from '../Form/Fields/Radio';

const IconElement = (props) => {
  const { label } = props;
  return (
    <Radio
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      label={<ActionButton icon={label} />}
    />
  );
};

IconElement.propTypes = {
  label: PropTypes.string.isRequired,
};

export default IconElement;
