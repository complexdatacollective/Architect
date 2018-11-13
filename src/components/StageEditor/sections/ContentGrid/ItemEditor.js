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
          <ValidatedField
            component={Mode}
            name={`${name}.size`}
            label="Display size"
            options={this.options}
            validation={{ required: true }}
          />
          <div id={getFieldId(`${name}.content`)} data-name={`${type} content`} />
          <ValidatedField
            label="Content"
            name={`${name}.content`}
            component={this.inputComponent}
            validation={{ required: true }}
          />
          <Button
            type="button"
            size="small"
            onClick={onComplete}
            disabled={error}
          >
           Done
          </Button>
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
