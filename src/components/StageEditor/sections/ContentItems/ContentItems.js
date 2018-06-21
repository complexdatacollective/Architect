import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FieldArray, arrayPush } from 'redux-form';
import uuid from 'uuid';
import Guidance from '../../../Guidance';
import AddContentButton from './AddContentButton';
import Items from '../../Sortable/Items';
import ContentItem from './ContentItem';

const ContentItems = ({ form, createNewItem }) => (
  <Guidance contentId="guidance.editor.content_items">
    <div className="stage-editor-section-content-items">
      <h2>Content</h2>
      <p>Create any content you wish to display on the information screen.</p>
      <FieldArray
        name="items"
        component={Items}
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
  </Guidance>
);

ContentItems.propTypes = {
  createNewItem: PropTypes.func.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = (dispatch, { form }) => ({
  createNewItem: bindActionCreators(
    type => arrayPush(form.name, 'items', { id: uuid(), type }),
    dispatch,
  ),
});

export default connect(null, mapDispatchToProps)(ContentItems);
