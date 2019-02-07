import React from 'react';
import File from './File';
import { BackgroundImage } from '../../Assets';

const ImageInput = props => (
  <File
    accept="image/*"
    type="image"
    {...props}
  >
    { id => (
      <div className="form-fields-image">
        <BackgroundImage id={id} className="form-fields-image__image" />
      </div>
    ) }
  </File>
);

export default ImageInput;
