import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import { Field } from 'redux-form';
import { Markdown, Image, Audio, Video, Mode } from '../../../Form/Fields';
import { Button } from '../../../../ui/components';
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

const getSizeOptions = (currentSize, spareCapacity) =>
  sizeOptions.map(
    option => (
      units[option.value] <= spareCapacity ||
      units[option.value] <= units[currentSize] ?
        option :
        { ...option, disabled: true }
    ),
  );

const getInputComponent = type =>
  get(contentInputs, type, Markdown);

const ItemEditor = ({ name, show, type, size, spareCapacity, onComplete }) => (
  <div className={cx('content-grid-editor', { 'content-grid-editor--show': show })}>
    <div onClick={e => e.stopPropagation()}>
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
      <Button
        type="button"
        size="small"
        onClick={onComplete}
      >Done</Button>
    </div>
  </div>
);

ItemEditor.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf([sizes.SMALL, sizes.MEDIUM, sizes.LARGE]),
  show: PropTypes.bool,
  spareCapacity: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
};

ItemEditor.defaultProps = {
  show: false,
  content: null,
  type: null,
  size: null,
  spareCapacity: 0,
};

export default ItemEditor;
