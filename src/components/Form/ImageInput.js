import React from 'react';
import PropTypes from 'prop-types';
import FileInput from './FileInput';
import { Image } from '../Assets';

const ImageInput = ({ value, onChange }) => (
  <FileInput
    value={value}
    onChange={onChange}
    accept="image/*"
    className="image-input"
  >
    { url => (
      <div className="image-input__preview">
        <Image url={url} alt="" />
      </div>
    ) }
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
