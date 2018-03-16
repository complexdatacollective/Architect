import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import { Section, Editor, Guidance } from '../../Guided';
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
  ({ items, updateItem, deleteItem }) => (
    <div className="stage-editor-section-content-items__items">
      { items.map(
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
      items: PropTypes.array,
    }),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    stage: {
      items: [],
    },
    onChange: () => {},
  };

  moveItem = ({ oldIndex, newIndex }) => {
    const reorderedContentItems = arrayMove(this.props.stage.items, oldIndex, newIndex);

    this.props.onChange({
      items: reorderedContentItems,
    });
  };

  createNewItem = (type) => {
    const items = this.props.stage.items || [];
    this.props.onChange({ items: [...items, { type, content: undefined }] });
  }

  updateItem = (newItem, index) => {
    const items = this.props.stage.items
      .map((item, i) => {
        if (i !== index) { return item; }
        return newItem;
      });

    this.props.onChange({ items });
  }

  deleteItem = (index) => {
    const items = this.props.stage.items
      .filter((_, i) => i !== index);

    this.props.onChange({ items });
  }

  hasContentItems = () =>
    this.props.stage.items && this.props.stage.items.length > 0;

  render() {
    const {
      stage: { items },
      onChange,
      ...props
    } = this.props;

    return (
      <Section className="stage-editor-section" {...props}>
        <Editor className="stage-editor-section__edit">
          <div className="stage-editor-section-content-items">
            <h2>Content</h2>
            {
              !this.hasContentItems() &&
              <p>Choose a content type from below.<br /><br /></p>
            }

            {
              this.hasContentItems() &&
              <SortableItems
                items={items}
                updateItem={this.updateItem}
                deleteItem={this.deleteItem}
                onSortEnd={this.moveItem}
                lockAxis="y"
                useDragHandle
              />
            }

            <div className="stage-editor-section-content-items__controls">
              <AddButton onClick={() => this.createNewItem('text')} type="text">Text</AddButton>
              <AddButton onClick={() => this.createNewItem('image')} type="image">Image</AddButton>
              <AddButton onClick={() => this.createNewItem('audio')} type="audio">Audio</AddButton>
              <AddButton onClick={() => this.createNewItem('video')} type="video">Video</AddButton>
            </div>
          </div>
        </Editor>
        <Guidance className="stage-editor-section__guidance">
          Add your content here
        </Guidance>
      </Section>
    );
  }
}

export default ContentItems;
