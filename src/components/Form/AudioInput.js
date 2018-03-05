import React from 'react';
import PropTypes from 'prop-types';
import FileInput from './FileInput';
import { Audio } from '../Assets';

const AudioInput = ({ value, onChange }) => (
  <FileInput
    value={value}
    onChange={onChange}
    accept="audio/*"
    className="audio-input"
    completeClassName="audio-input--complete"
  >
    { url => (
      <div className="audio-input__preview">
        <Audio url={url} controls />
      </div>
    ) }
  </FileInput>
);

AudioInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

AudioInput.defaultProps = {
  value: '',
};

export default AudioInput;
