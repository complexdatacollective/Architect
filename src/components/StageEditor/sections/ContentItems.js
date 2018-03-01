import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../components/Form';
import ContentItem from './ContentItem';

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

  render() {
    const {
      stage: { contentItems },
    } = this.props;

    return ([
      <div className="edit-stage__section" key="edit">
        { contentItems &&
          contentItems.map(
            (props, index) => (
              <ContentItem
                {...props}
                key={index}
                onChange={item => this.updateItem(item, index)}
              />
            ),
          )
        }
        <div>
          <Button onClick={() => this.createNewItem('text')}>Add copy</Button>
          <Button onClick={() => this.createNewItem('image')}>Add image</Button>
          <Button onClick={() => this.createNewItem('audio')}>Add audio</Button>
          <Button onClick={() => this.createNewItem('video')}>Add video</Button>
        </div>
      </div>,
      <div className="edit-skip-logic__guidance" key="guidance">
        Add your content here
      </div>,
    ]);
  }
}

export default ContentItems;
