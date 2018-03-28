import React from 'react';
import { fieldPropTypes } from 'redux-form';
import FileInput from './FileInput';
import { Video } from '../Assets';

const VideoInput = props => (
  <FileInput
    accept="video/*"
    className="video-input"
    {...props}
  >
    { url => (
      <div className="video-input__preview">
        <Video className="video-input__preview-still" url={url} />
        <div className="video-input__preview-name">{ props.input.value }</div>
      </div>
    ) }
  </FileInput>
);

VideoInput.propTypes = {
  ...fieldPropTypes,
};

export default VideoInput;
