import React from 'react';
import FileInput from './FileInput';
import { Image } from '../Assets';

const ImageInput = props => (
  <FileInput
    accept="image/*"
    className="image-input"
    {...props}
  >
    { url => (
      <div className="image-input__preview">
        <Image url={url} alt="" />
      </div>
    ) }
  </FileInput>
);

export default ImageInput;
