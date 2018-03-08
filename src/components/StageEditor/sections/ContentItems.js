import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import { Section, Edit, Guidance } from '../../Guided';
import { Button } from '../../../components/Form';
import ContentItem from './ContentItem';

// eslint-disable-next-line
const AddButton = ({ onClick, type, children }) => (
  <Button
    className={`stage-editor-section-content-items__control stage-editor-section-content-items__control--${type}`}
    onClick={onClick}
  >
    {children}
  </Button>
);

const SortableItems = SortableContainer(
  ({ contentItems, updateItem, deleteItem }) => (
    <div className="stage-editor-section-content-items__items">
      { contentItems.map(
        (props, index) => (
          <ContentItem
            {...props}
            index={index}
            key={index}
            onChange={item => updateItem(item, index)}
            onDelete={() => deleteItem(index)}
          />
        ),
      ) }
    </div>
  ),
);

class ContentItems extends Component {
  static propTypes = {
    stage: PropTypes.shape({
      contentItems: PropTypes.array,
    }),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    stage: {
      contentItems: [],
    },
    onChange: () => {},
  };

  moveItem = ({ oldIndex, newIndex }) => {
    const reorderedContentItems = arrayMove(this.props.stage.contentItems, oldIndex, newIndex);

    this.props.onChange({
      contentItems: reorderedContentItems,
    });
  };

  createNewItem = (type) => {
    const contentItems = this.props.stage.contentItems || [];
    this.props.onChange({ contentItems: [...contentItems, { type, content: undefined }] });
  }

  updateItem = (newItem, index) => {
    const contentItems = this.props.stage.contentItems
      .map((item, i) => {
        if (i !== index) { return item; }
        return newItem;
      });

    this.props.onChange({ contentItems });
  }

  deleteItem = (index) => {
    const contentItems = this.props.stage.contentItems
      .filter((_, i) => i !== index);

    this.props.onChange({ contentItems });
  }

  hasContentItems = () =>
    this.props.stage.contentItems && this.props.stage.contentItems.length > 0;

  render() {
    const {
      stage: { contentItems },
      onChange,
      ...props
    } = this.props;

    return (
      <Section className="stage-editor-section" {...props}>
        <Edit className="stage-editor-section__edit">
          <div className="stage-editor-section-content-items">
            <h2>Content</h2>
            {
              !this.hasContentItems() &&
              <p>Choose a content type from below.<br /><br /></p>
            }

            {
              this.hasContentItems() &&
              <SortableItems
                contentItems={contentItems}
                updateItem={this.updateItem}
                deleteItem={this.deleteItem}
                onSortEnd={this.moveItem}
                lockAxis="y"
                useDragHandle
              />
            }

            <div className="stage-editor-section-content-items__controls">
              <AddButton onClick={() => this.createNewItem('text')} type="text">Copy</AddButton>
              <AddButton onClick={() => this.createNewItem('image')} type="image">Image</AddButton>
              <AddButton onClick={() => this.createNewItem('audio')} type="audio">Audio</AddButton>
              <AddButton onClick={() => this.createNewItem('video')} type="video">Video</AddButton>
            </div>
          </div>
        </Edit>
        <Guidance className="stage-editor-section__guidance">
          Add your content here
        </Guidance>
      </Section>
    );
  }
}

export default ContentItems;
