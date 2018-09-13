import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import { Field } from 'redux-form';
import { Markdown, Image, Audio, Video, Mode } from '../../../Form/Fields';
import { RadioGroup } from '../../../../ui/components/Fields';
import * as sizes from './sizes';

const sizeOptions = [
  { label: 'Small', value: sizes.SMALL },
  { label: 'Medium', value: sizes.MEDIUM },
  { label: 'Large', value: sizes.LARGE },
];

const contentInputs = {
  text: Markdown,
  image: Image,
  audio: Audio,
  video: Video,
};

const getInputComponent = type =>
  get(contentInputs, type, Markdown);

const ItemEditor = ({ name, type, show }) => (
  <div className={cx('content-grid-editor', { 'content-grid-editor--show': show })}>
    <div onClick={e => e.stopPropagation()}>
      <Field
        component={Mode}
        name={`${name}.size`}
        label="Display size"
        options={sizeOptions}
      />
      <Field
        label="Content"
        name={`${name}.content`}
        component={getInputComponent(type)}
      />
    </div>
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
