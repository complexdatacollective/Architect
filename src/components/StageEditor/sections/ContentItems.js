import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import { Button } from '../../../components/Form';
import ContentItem from './ContentItem';

const SortableItems = SortableContainer(
  ({ contentItems, updateItem, deleteItem }) => (
    <div className="content-items__items">
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

  render() {
    const {
      stage: { contentItems },
    } = this.props;

    return ([
      <div className="edit-stage__section" key="edit">
        <div className="content-items">
          {
            contentItems &&
            <SortableItems
              contentItems={contentItems}
              updateItem={this.updateItem}
              deleteItem={this.deleteItem}
              onSortEnd={this.moveItem}
              lockAxis="y"
              useDragHandle
            />
          }

          <div className="content-items__controls">
            <Button
              className="content-items__control"
              onClick={() => this.createNewItem('text')}
            >
              Add copy
            </Button>
            <Button
              className="content-items__control"
              onClick={() => this.createNewItem('image')}
            >
              Add image
            </Button>
            <Button
              className="content-items__control"
              onClick={() => this.createNewItem('audio')}
            >
              Add audio
            </Button>
            <Button
              className="content-items__control"
              onClick={() => this.createNewItem('video')}
            >
              Add video
            </Button>
          </div>
        </div>
      </div>,
      <div className="edit-skip-logic__guidance" key="guidance">
        Add your content here
      </div>,
    ]);
  }
}

export default ContentItems;
