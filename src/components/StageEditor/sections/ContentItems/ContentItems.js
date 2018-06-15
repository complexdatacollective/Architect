import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FieldArray, arrayPush } from 'redux-form';
import uuid from 'uuid';
import AddContentButton from './AddContentButton';
import SortableItems from '../../SortableItems';
import ContentItem from './ContentItem';

const ContentItems = ({ form, createNewItem }) => (
  <div className="stage-editor-section-content-items">
    <h2>Content</h2>
    <p>Create any content you wish to display on the information screen.</p>
    <FieldArray
      name="items"
      component={SortableItems}
      itemComponent={ContentItem}
      form={form}
    />

    <div className="stage-editor-section-content-items__controls">
      <AddContentButton onClick={() => createNewItem('text')} type="text">Text</AddContentButton>
      <AddContentButton onClick={() => createNewItem('image')} type="image">Image</AddContentButton>
      <AddContentButton onClick={() => createNewItem('audio')} type="audio">Audio</AddContentButton>
      <AddContentButton onClick={() => createNewItem('video')} type="video">Video</AddContentButton>
    </div>
  </div>
);

ContentItems.propTypes = {
  createNewItem: PropTypes.func.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
};

ContentItems.Guidance = (
  <React.Fragment>
    <h3>Content Items help</h3>
    <p>
      Each information interface can display up to four &quot;content boxes&quot;. Each content box
      can display either: text, an image, a video, or some audio.
    </p>
    <p>
      You can use markdown style syntax to add formatting to your text. Supported formatting
      includes headings, bold, italic, and external links.
    </p>
    <p>
      If you are adding media, you can either select from existing assets, or drag new media into
      the content box you prefer.
    </p>
  </React.Fragment>
);

const mapDispatchToProps = (dispatch, { form }) => ({
  createNewItem: bindActionCreators(
    type => arrayPush(form.name, 'items', { id: uuid(), type }),
    dispatch,
  ),
});

export default connect(null, mapDispatchToProps)(ContentItems);
