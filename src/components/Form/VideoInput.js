import React from 'react';
import PropTypes from 'prop-types';
import FileInput from './FileInput';
import { Video } from '../Assets';

const VideoInput = ({ value, onChange }) => (
  <FileInput
    value={value}
    onChange={onChange}
    accept="video/*"
    className="video-input"
  >
    { url => (
      <div className="video-input__preview">
        <Video className="video-input__preview-still" url={url} />
        <div className="video-input__preview-name">{ value }</div>
      </div>
    ) }
  </FileInput>
);

VideoInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

VideoInput.defaultProps = {
  value: '',
};

export default VideoInput;
