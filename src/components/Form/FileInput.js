import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assets';

class FileInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    importAsset: PropTypes.func.isRequired,
    value: PropTypes.string,
    accept: PropTypes.string,
    children: PropTypes.func,
  };

  static defaultProps = {
    label: '',
    value: '',
    accept: '',
    children: value => value,
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      this.props.importAsset(file)
        .then(({ filename }) => {
          this.props.onChange(filename);
        });
    });
  }

  render() {
    const {
      value,
      accept,
    } = this.props;

    return (
      <div className="file-input">
        { value &&
          <div className="file-input__preview">{this.props.children(value)}</div>
        }
        <Dropzone
          onDrop={this.onDrop}
          multiple={false}
          accept={accept}
          className={cx('file-input__dropzone', { 'file-input__dropzone--replace': !!value })}
          activeClassName="file-input__dropzone--active"
          acceptClassName="file-input__dropzone--accept"
          rejectClassName="file-input__dropzone--reject"
          disabledClassName="file-input__dropzone--disabled"
        />
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

export { FileInput };

export default connect(null, mapDispatchToProps)(FileInput);
