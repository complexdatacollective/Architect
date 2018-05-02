import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FieldArray, arrayPush } from 'redux-form';
import uuid from 'uuid';
import { Button } from '../../../../ui/components';
import { Section, Editor, Guidance } from '../../../Guided';
import SortableItems from '../../SortableItems';
import ContentItem from './ContentItem';

const AddButton = ({ onClick, type, children }) => (
  <Button
    type="button"
    size="small"
    className={`button button--small stage-editor-section-content-items__control stage-editor-section-content-items__control--${type}`}
    onClick={onClick}
  >
    {children}
  </Button>
);

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

const ContentItems = ({ form, createNewItem, ...rest }) => (
  <Section className="stage-editor-section" {...rest}>
    <Editor className="stage-editor-section__edit">
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
          <AddButton onClick={() => createNewItem('text')} type="text">Text</AddButton>
          <AddButton onClick={() => createNewItem('image')} type="image">Image</AddButton>
          <AddButton onClick={() => createNewItem('audio')} type="audio">Audio</AddButton>
          <AddButton onClick={() => createNewItem('video')} type="video">Video</AddButton>
        </div>
      </div>
    </Editor>
    <Guidance className="stage-editor-section__guidance">
      This is where you can add text and media items to your information screen.
    </Guidance>
  </Section>
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
