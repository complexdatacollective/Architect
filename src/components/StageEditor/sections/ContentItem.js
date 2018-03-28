import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { MarkdownInput, ImageInput, AudioInput, VideoInput } from '../../../components/Form';

const contentInputs = {
  text: MarkdownInput,
  image: ImageInput,
  audio: AudioInput,
  video: VideoInput,
};

const getContentInput = type => get(contentInputs, type, MarkdownInput);

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
  type: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { fieldId, form }) => ({
  type: form.getValues(state, `${fieldId}.type`),
});

export default connect(mapStateToProps)(ContentItem);
