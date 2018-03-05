import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MarkdownInput, ImageInput, AudioInput, VideoInput } from '../../../components/Form';

const contentInputs = {
  text: MarkdownInput,
  image: ImageInput,
  audio: AudioInput,
  video: VideoInput,
};

const Handle = SortableHandle(() => (<span>::</span>));

const ContentItem = ({ type, content, onChange }) => {
  const ContentInput = contentInputs[type];

  return (
    <div style={{ border: '2px solid black', background: 'pink' }}>
      <Handle />
      CONTENT ITEM
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

export default SortableElement(ContentItem);
