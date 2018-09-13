import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import { Field } from 'redux-form';
import { Markdown, Image, Audio, Video, Mode } from '../../../Form/Fields';
import { units, sizes } from './sizes';

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

const getSizeOptions = (currentSize, spareCapacity) => {
  console.log({ units, sizeOptions, currentSize, spareCapacity });
  return sizeOptions.map(
    option => (
      units[option.value] <= spareCapacity ||
      units[option.value] <= units[currentSize] ?
        option :
        { ...option, disabled: true }
    ),
  );
};

const getInputComponent = type =>
  get(contentInputs, type, Markdown);

const ItemEditor = ({ name, type, size, show, spareCapacity }) => (
  <div className={cx('content-grid-editor', { 'content-grid-editor--show': show })}>
    <div onClick={e => e.stopPropagation()}>
      {size}
      <Field
        component={Mode}
        name={`${name}.size`}
        label="Display size"
        options={getSizeOptions(size, spareCapacity)}
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
