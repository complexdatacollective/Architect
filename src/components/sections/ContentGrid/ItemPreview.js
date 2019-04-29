import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { BackgroundImage, Video, Audio } from '../../Assets';
import Icon from '../../../ui/components/Icon';

const AssetComponent = ({ type, content }) => {
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

const ItemPreview = ({
  onEdit,
  onDelete,
  type,
  content,
}) => (
  <div className="content-grid-preview">
    <div
      className="content-grid-preview__edit"
      onClick={onEdit}
    >edit</div>
    <div className="content-grid-preview__content">
      <AssetComponent type={type} content={content} />
    </div>
    <div
      className="content-grid-preview__delete"
      onClick={onDelete}
    ><Icon name="delete" /></div>
  </div>
);

ItemPreview.propTypes = {
  content: PropTypes.string,
  type: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

ItemPreview.defaultProps = {
  content: null,
  type: null,
};

export { ItemPreview };

export default ItemPreview;
