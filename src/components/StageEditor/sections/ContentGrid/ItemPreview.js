import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Icon } from '../../../../ui/components';
import Markdown from 'react-markdown';
import { BackgroundImage, Video, Audio } from '../../../Assets';
import { SMALL, MEDIUM, LARGE } from './index';

const PreviewComponent = ({ input: { value: { type, content } } }) => {
  switch (type) {
    case 'image':
      return <BackgroundImage url={content} />;
    case 'video':
      return <Video url={content} controls />;
    case 'audio':
      return <Audio url={content} controls />;
    case 'text':
      return <Markdown source={content} />;
    default:
      return content;
  }
};

const ItemPreview = ({ name, onDelete }) => (
  <div className="content-grid-preview">
    <div className="content-grid-preview__preview">
      <Field name={name} component={PreviewComponent} />
    </div>
    <div className="content-grid-preview__delete" onClick={onDelete}>
      <Icon name="delete" />
    </div>
  </div>
);

ItemPreview.propTypes = {
  content: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf([SMALL, MEDIUM, LARGE]),
  onDelete: PropTypes.func.isRequired,
};

ItemPreview.defaultProps = {
  content: null,
  type: null,
  size: null,
};

export default ItemPreview;
