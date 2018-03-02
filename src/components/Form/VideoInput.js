import React from 'react';
import PropTypes from 'prop-types';
import FileInput from './FileInput';
import { Video } from '../Assets';

const VideoInput = ({ value, onChange }) => (
  <FileInput
    value={value}
    onChange={onChange}
    accept="video/*"
  >
    { url => (<Video controls url={url} />) }
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
