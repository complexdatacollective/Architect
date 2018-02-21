import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { uniqueId } from 'lodash';
import cx from 'classnames';

class FileInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.func,
  };

  static defaultProps = {
    label: '',
    value: '',
    onChange: () => {},
    children: value => value,
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onChange = () => {
    this.props.onChange();
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        console.log(fileAsBinaryString);
        // do whatever you want with the file content
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  }

  render() {
    const {
      value,
      label,
    } = this.props;

    return (
      <label htmlFor={this.id} className={cx('rich-text')}>
        <div className={cx('rich-text__label')}>
          {label}
        </div>
        <div>{this.props.children(value)}</div>
        <Dropzone onDrop={this.onDrop} multiple={false} />,
      </label>
    );
  }
}

export default FileInput;
