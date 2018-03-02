import React from 'react';
import PropTypes from 'prop-types';
import { MarkdownInput, ImageInput, AudioInput, VideoInput } from '../../../components/Form';

const contentInputs = {
  text: MarkdownInput,
  image: ImageInput,
  audio: AudioInput,
  video: VideoInput,
};

const ContentItem = ({ type, content, onChange }) => {
  const ContentInput = contentInputs[type];

  return (
    <div styles={{ borderTop: '2px', borderColor: 'black' }}>
      <ContentInput value={content} onChange={value => onChange({ type, content: value })} />
    </div>
  );
};

ContentItem.propTypes = {
  type: PropTypes.string.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ContentItem.defaultProps = {
  content: '',
};

export default ContentItem;
