import React from 'react';
import File from './File';
import { BackgroundImage } from '../../Assets';

const ImageInput = (props) => (
  <File
    type="image"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    { (id) => (
      <div className="form-fields-image">
        <BackgroundImage id={id} className="form-fields-image__image" />
      </div>
    ) }
  </File>
);

export default ImageInput;
