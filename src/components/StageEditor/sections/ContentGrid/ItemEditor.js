import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';
import ValidatedField from '../../../Form/ValidatedField';
import { Markdown, Image, Audio, Video, Mode } from '../../../Form/Fields';
import { Button } from '../../../../ui/components';
import { getFieldId } from '../../../../utils/issues';
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

const willFit = (option, currentSize, spareCapacity) =>
  option <= spareCapacity + currentSize;

const getSizeOptions = (sizeSetting, spareCapacity) => {
  const currentSize = !sizeSetting ? 0 : units[sizeSetting];
  return sizeOptions.map(
    option => (
      willFit(units[option.value], currentSize, spareCapacity) ?
        option :
        { ...option, disabled: true }
    ),
  );
};

const getInputComponent = type =>
  get(contentInputs, type, Markdown);

class ItemEditor extends Component {
  get options() {
    const { size, spareCapacity } = this.props;
    return getSizeOptions(size, spareCapacity);
  }

  get inputComponent() {
    const { type } = this.props;
    return getInputComponent(type);
  }

  render() {
    const { name, show, onComplete, error, type } = this.props;

    return (
      <div className={cx('content-grid-editor', { 'content-grid-editor--show': show })}>
        <div className="content-grid-editor__content" onClick={e => e.stopPropagation()}>
          <div id={getFieldId(`${name}.size`)} data-name="Display size" />
          <h4>Display Size</h4>
          <p>
            Your information screen has limited space for different sized content boxes. You have a
            budget of 4 units of space, and each box size costs as follows:
          </p>
          <ul>
            <li>Large: 4 units</li>
            <li>Medium: 2 units</li>
            <li>Small: 1 unit</li>
          </ul>
          <p>
            Since an information screen can only show so much information, you must choose the size
            of your content boxes carefully. Remember that you can display multiple information
            screens consecutively, if needed.
          </p>
          <ValidatedField
            component={Mode}
            name={`${name}.size`}
            label=""
            options={this.options}
            validation={{ required: true }}
          />
          <br />
          <div id={getFieldId(`${name}.content`)} data-name={`${type} content`} />
          <ValidatedField
            label="Content"
            name={`${name}.content`}
            component={this.inputComponent}
            validation={{ required: true }}
          />
          <div className="content-grid-editor__controls">
            <Button
              type="button"
              onClick={onComplete}
              disabled={error}
            >
             Done
            </Button>
          </div>
        </div>
      </div>
    );
  }
}


ItemEditor.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf([sizes.SMALL, sizes.MEDIUM, sizes.LARGE]),
  show: PropTypes.bool,
  spareCapacity: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
  error: PropTypes.object,
};

ItemEditor.defaultProps = {
  show: false,
  content: null,
  type: null,
  size: null,
  spareCapacity: 0,
  error: undefined,
};

export { ItemEditor };

export default ItemEditor;
