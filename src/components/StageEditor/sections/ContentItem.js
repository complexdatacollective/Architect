import React from 'react';
import PropTypes from 'prop-types';
import { MarkdownInput, FileInput } from '../../../components/Form';

const contentTypes = {
  text: MarkdownInput,
  image: (value, onChange) => (
    <FileInput value={value} onChange={onChange}>{ src => (<img src={src} alt="preview" />) }</FileInput>
  ),
  audio: FileInput,
  video: FileInput,
};

const ContentItem = ({ type, content, onChange }) => {
  const ContentType = contentTypes[type];

  return (
    <div styles={{ borderTop: '2px', borderColor: 'black' }}>
      <ContentType value={content} onChange={value => onChange({ type, content: value })} />
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
