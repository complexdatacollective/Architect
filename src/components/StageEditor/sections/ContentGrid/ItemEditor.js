import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import { Field } from 'redux-form';
import * as Fields from '../../../Form/Fields';

const contentInputs = {
  text: Fields.Markdown,
  image: Fields.Image,
  audio: Fields.Audio,
  video: Fields.Video,
};

const getInputComponent = type =>
  get(contentInputs, type, Fields.Markdown);

const ItemEditor = ({ name, type, show }) => (
  <div className={cx('content-grid-editor', { 'content-grid-editor--show': show })}>
    <Field name={name} component={getInputComponent(type)} />
  </div>
);

ItemEditor.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  show: PropTypes.bool,
};

ItemEditor.defaultProps = {
  show: false,
};

export default ItemEditor;
