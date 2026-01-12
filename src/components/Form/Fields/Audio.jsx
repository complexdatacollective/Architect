import React from 'react';
import File from './File';
import { Audio } from '../../Assets';

const AudioInput = (props) => (
  <File
    type="audio"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    { (id) => (
      <div className="form-fields-audio">
        <Audio id={id} controls />
      </div>
    ) }
  </File>
);

export default AudioInput;
