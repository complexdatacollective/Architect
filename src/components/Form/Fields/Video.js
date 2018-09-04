import React from 'react';
import { fieldPropTypes } from 'redux-form';
import File from './File';
import { Video } from '../../Assets';

const VideoInput = props => (
  <File
    accept="video/*"
    {...props}
  >
    { url => (
      <div className="form-fields-video">
        <Video className="form-fields-video__still" url={url} controls />
      </div>
    ) }
  </File>
);

VideoInput.propTypes = {
  ...fieldPropTypes,
};

export default VideoInput;
