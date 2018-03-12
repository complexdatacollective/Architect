import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Icon } from 'network-canvas-ui';
import { Button, MarkdownInput, ImageInput, AudioInput, VideoInput } from '../../../components/Form';

const contentInputs = {
  text: MarkdownInput,
  image: ImageInput,
  audio: AudioInput,
  video: VideoInput,
};

const Handle = SortableHandle(() => (
  <div className="stage-editor-section-content-item__handle" />
));

const ContentItem = ({ type, content, onChange, onDelete }) => {
  const ContentInput = contentInputs[type];

  return (
    <div className="stage-editor-section-content-item">
      <Handle />

      <div className="stage-editor-section-content-item__content">
        <ContentInput
          value={content}
          onChange={value => onChange({ type, content: value })}
        />
      </div>

      <Button
        className="stage-editor-section-content-item__delete"
        onClick={onDelete}
      ><Icon name="close" /></Button>
    </div>
  );
};

ContentItem.propTypes = {
  type: PropTypes.string.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

ContentItem.defaultProps = {
  content: '',
};

export default SortableElement(ContentItem);
