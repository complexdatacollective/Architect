import React from 'react';
import PropTypes from 'prop-types';
import FileInput from './FileInput';

const AudioInput = ({ value, onChange }) => (
  <FileInput
    value={value}
    onChange={onChange}
    accept="audio/*"
    className="audio-input"
    completeClassName="audio-input--complete"
  >
    { () => (
      <div className="audio-input__preview">
        { value }
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
