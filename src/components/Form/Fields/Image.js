import React from 'react';
import File from './File';
import { Image } from '../../Assets';

const ImageInput = props => (
  <File
    accept="image/*"
    {...props}
  >
    { url => (
      <div className="form-fields-image">
        <Image url={url} alt={url} className="form-fields-image__image" />
      </div>
    ) }
  </File>
);

export default ImageInput;
