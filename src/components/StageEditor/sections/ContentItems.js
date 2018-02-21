import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, MarkdownInput } from '../../../components/Form';

// const contentTypes = {
//   text: MarkdownInput,
//   image: MarkdownInput,
//   audio: MarkdownInput,
//   video: MarkdownInput,
// };

const ContentItem = ({ type, content, onChange }) => {
  const ContentType = MarkdownInput; // contentTypes[type];

  return (
    <div styles={{ borderTop: '2px', borderColor: 'black' }}>
      <ContentType value={content} onChange={value => onChange({ type, content: value })} />
    </div>
  );
};

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
    console.log('NEW ITEM', this.props.stage.contentItems, type);
    const contentItems = this.props.stage.contentItems || [];
    this.props.onChange({ contentItems: [...contentItems, { type, content: undefined }] });
  }

  updateItem = (newItem, index) => {
    console.log('UPDATE ITEM', this.props.stage.contentItems, newItem, index);
    const contentItems = this.props.stage.contentItems
      .map((item, i) => {
        if (i !== index) { return item; }
        return newItem;
      });
    console.log({ contentItems });
    this.props.onChange({ contentItems });
  }

  render() {
    const {
      stage: { contentItems },
    } = this.props;

    return ([
      <div className="edit-stage__section">
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
          <Button onClick={() => this.createNewItem('copy')}>Add copy</Button>
          <Button onClick={() => this.createNewItem('image')}>Add image</Button>
          <Button onClick={() => this.createNewItem('audio')}>Add audio</Button>
          <Button onClick={() => this.createNewItem('video')}>Add video</Button>
        </div>
      </div>,
      <div className="edit-skip-logic__guidance">
        Add your content here
      </div>,
    ]);
  }
}

export default ContentItems;
