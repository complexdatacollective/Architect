import React from 'react';
import File from './File';

const AudioInput = props => (
  <File
    accept="audio/*"
    completeClassName="form-fields-audio--complete"
    {...props}
  >
    { value => (
      <div className="form-fields-audio">
        { value }
      </div>
    ) }
  </File>
);

export default AudioInput;
