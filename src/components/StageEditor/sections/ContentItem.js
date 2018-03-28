/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { get } from 'lodash';
import { Button, MarkdownInput, ImageInput, AudioInput, VideoInput, SeamlessTextInput } from '../../../components/Form';

const contentInputs = {
  text: MarkdownInput,
  image: ImageInput,
  audio: AudioInput,
  video: VideoInput,
};

const getContentInput = (type) =>
  get(contentInputs, type, MarkdownInput);

const ContentItem = ({ fieldId, type }) => {
  const ContentInput = getContentInput(type);

  return (
    <div>
      <Field
        name={`${fieldId}.value`}
        component={ContentInput}
      />
    </div>
  );
};

ContentItem.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

const formValue = formValueSelector('edit-stage');

const mapStateToProps = (state, { fieldId }) => ({
  type: formValue(state, `${fieldId}.type`),
})

export default connect(mapStateToProps)(ContentItem);
