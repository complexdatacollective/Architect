import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { get } from 'lodash';
import * as Fields from '../../../../components/Form/Fields';
import Handle from '../../Sortable/Handle';

const contentInputs = {
  text: Fields.Markdown,
  image: Fields.Image,
  audio: Fields.Audio,
  video: Fields.Video,
};

const getContentInput = type => get(contentInputs, type, Fields.Markdown);

const ContentItem = ({ fieldId, type, handleDelete }) => {
  const ContentInput = getContentInput(type);

  return (
    <div>
      <Handle />

      <Field
        name={`${fieldId}.content`}
        component={ContentInput}
      />

      <div onClick={handleDelete}>delete</div>
    </div>
  );
};

ContentItem.propTypes = {
  fieldId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { fieldId, form }) => ({
  type: form.getValues(state, `${fieldId}.type`),
});

export default connect(mapStateToProps)(ContentItem);
