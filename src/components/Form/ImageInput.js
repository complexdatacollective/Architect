import React from 'react';
import PropTypes from 'prop-types';
import FileInput from './FileInput';
import { Image } from '../Assets';

const ImageInput = ({ value, onChange }) => (
  <FileInput
    value={value}
    onChange={onChange}
    accept="image/*"
  >
    { url => (<Image url={url} alt="preview" />) }
  </FileInput>
);

ImageInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ImageInput.defaultProps = {
  value: '',
};

export default ImageInput;
