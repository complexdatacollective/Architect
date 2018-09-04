import React from 'react';
import File from './File';
import { Audio } from '../../Assets';

const AudioInput = props => (
  <File
    accept="audio/*"
    completeClassName="form-fields-audio--complete"
    {...props}
  >
    { url => (
      <div className="form-fields-audio">
        <Audio url={url} controls />
      </div>
    ) }
  </File>
);

export default AudioInput;
