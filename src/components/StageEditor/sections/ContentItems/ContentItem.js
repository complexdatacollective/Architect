import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { get } from 'lodash';
import * as Fields from '../../../../components/Form/Fields';
import { Item } from '../../Sortable';

const contentInputs = {
  text: Fields.Markdown,
  image: Fields.Image,
  audio: Fields.Audio,
  video: Fields.Video,
};

const getContentInput = type => get(contentInputs, type, Fields.Markdown);

const ContentItem = ({ fieldId, type, ...rest }) => {
  const ContentInput = getContentInput(type);

  return (
    <Item {...rest}>
      <Field
        name={`${fieldId}.content`}
        component={ContentInput}
      />
    </Item>
  );
};

ContentItem.propTypes = {
  fieldId: PropTypes.string.isRequired,
  type: PropTypes.string,
};

ContentItem.defaultProps = {
  type: null,
};

const mapStateToProps = (state, { fieldId, form }) => ({
  type: form.getValues(state, `${fieldId}.type`),
});

export default connect(mapStateToProps)(ContentItem);
