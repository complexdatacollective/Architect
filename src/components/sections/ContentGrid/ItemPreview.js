import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { BackgroundImage, Video, Audio } from '../../Assets';

const ItemPreview = ({ type, content }) => {
  switch (type) {
    case 'image':
      return <BackgroundImage id={content} />;
    case 'video':
      return <Video id={content} controls />;
    case 'audio':
      return <Audio id={content} controls />;
    case 'text':
      return <Markdown source={content} />;
    default:
      return content;
  }
};

ItemPreview.propTypes = {
  content: PropTypes.string,
  type: PropTypes.string,
};

ItemPreview.defaultProps = {
  content: null,
  type: null,
};

export { ItemPreview };

export default ItemPreview;
