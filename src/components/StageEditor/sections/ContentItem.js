import React from 'react';
import PropTypes from 'prop-types';
import { MarkdownInput, FileInput } from '../../../components/Form';
import { Image, Audio, Video } from '../../../components/Assets';

// eslint-disable-next-line
const ImageInput = ({ value, onChange }) =>
  <FileInput value={value} onChange={onChange}>{ url => (<Image url={url} alt="preview" />) }</FileInput>;

// eslint-disable-next-line
const AudioInput = ({ value, onChange }) => (
  <FileInput value={value} onChange={onChange}>
    { url => (<Audio url={url} autoplay controls />) }
  </FileInput>
);

// eslint-disable-next-line
const VideoInput = ({ value, onChange }) => (
  <FileInput value={value} onChange={onChange}>
    { url => (<Video controls url={url} />) }
  </FileInput>
);

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
