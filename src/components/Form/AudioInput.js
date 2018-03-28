import React from 'react';
import FileInput from './FileInput';

const AudioInput = props => (
  <FileInput
    accept="audio/*"
    className="audio-input"
    completeClassName="audio-input--complete"
    {...props}
  >
    { value => (
      <div className="audio-input__preview">
        { value }
      </div>
    ) }
  </FileInput>
);

export default AudioInput;
