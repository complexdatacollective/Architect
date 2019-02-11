import React from 'react';
import File from './File';
import { Audio } from '../../Assets';

const AudioInput = props => (
  <File
    accept="audio/*"
    className="form-fields-audio"
    type="audio"
    {...props}
  >
    { url => (
      <div className="form-fields-audio__preview">
        <Audio url={url} controls />
      </div>
    ) }
  </File>
);

export default AudioInput;
