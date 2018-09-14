import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Markdown from 'react-markdown';
import { Handle, DeleteButton } from '../../../Items/';
import { BackgroundImage, Video, Audio } from '../../../Assets';
import { sizes } from './sizes';

const AssetComponent = ({ type, content }) => {
  switch (type) {
    case 'image':
      return <BackgroundImage url={content} className="content-grid-preview__image" />;
    case 'video':
      return <Video url={content} controls className="content-grid-preview__video" />;
    case 'audio':
      return <Audio url={content} controls className="content-grid-preview__audio" />;
    case 'text':
      return <Markdown source={content} className="content-grid-preview__text" />;
    default:
      return content;
  }
};

const ItemPreview = ({
  onDeleteItem,
  type,
  content,
  size,
}) => (
  <div
    className={cx(
      'content-grid-preview',
      `content-grid-preview--size-${size}`,
      `content-grid-preview--type-${type}`,
    )}
  >
    <Handle />
    <div className="content-grid-preview__preview">
      <AssetComponent type={type} content={content} />
    </div>
    <DeleteButton onClick={onDeleteItem} />
  </div>
);

ItemPreview.propTypes = {
  content: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf([sizes.SMALL, sizes.MEDIUM, sizes.LARGE]),
  onDeleteItem: PropTypes.func.isRequired,
};

ItemPreview.defaultProps = {
  content: null,
  type: null,
  size: null,
};

export { ItemPreview };

export default ItemPreview;
