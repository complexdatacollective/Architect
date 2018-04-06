import React from 'react';
import { fieldPropTypes } from 'redux-form';
import File from './File';
import { Video } from '../../Assets';

const VideoInput = props => (
  <File
    accept="video/*"
    className="form-fields-video"
    {...props}
  >
    { url => (
      <div className="form-fields-video__preview">
        <Video className="form-fields-video__preview-still" url={url} />
        <div className="form-fields-video__preview-name">{ props.input.value }</div>
      </div>
    ) }
  </File>
);

VideoInput.propTypes = {
  ...fieldPropTypes,
};

export default VideoInput;
