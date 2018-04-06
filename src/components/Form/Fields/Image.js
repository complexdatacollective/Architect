import React from 'react';
import File from './File';
import { Image } from '../../Assets';

const ImageInput = props => (
  <File
    accept="image/*"
    className="form-fields-image"
    {...props}
  >
    { url => (
      <div className="form-fields-image__preview">
        <Image url={url} alt="" />
      </div>
    ) }
  </File>
);

export default ImageInput;
