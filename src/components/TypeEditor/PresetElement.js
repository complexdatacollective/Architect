import React from 'react';
import PropTypes from 'prop-types';
import Radio from '../Form/Fields/Radio';
import PreviewNode from '../sections/fields/EntitySelectField/PreviewNode';

const PresetElement = (props) => {
  const { label, color } = props;
  return (
    <Radio
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      label={<PreviewNode label={label} color={color} />}
    />
  );
};

PresetElement.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default PresetElement;
