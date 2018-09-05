import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';
import { actionCreators as assetActions } from '../../../ducks/modules/protocol/assets';

class FileInput extends PureComponent {
  static propTypes = {
    importAsset: PropTypes.func.isRequired,
    className: PropTypes.string,
    completeClassName: PropTypes.string,
    accept: PropTypes.string,
    children: PropTypes.func,
    label: PropTypes.string,
    ...fieldPropTypes,
  };

  static defaultProps = {
    value: '',
    className: 'form-fields-file',
    completeClassName: 'form-fields-file--complete',
    accept: '',
    label: '',
    children: value => value,
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      this.props.importAsset(file)
        .then(({ filename }) => {
          this.props.input.onChange(filename);
        });
    });
  }

  render() {
    const {
      input: { value },
      accept,
      label,
      className,
      completeClassName,
    } = this.props;

    return (
      <div className={cx(className, { [completeClassName]: !!value })}>
        { label &&
          <div className="form-fields-file__label">{label}</div>
        }
        <div className={cx('form-fields-file__file', { 'form-fields-file__file--replace': !!value })}>
          <Dropzone
            onDrop={this.onDrop}
            multiple={false}
            accept={accept}
            className={cx('form-dropzone', { 'form-dropzone--replace': !!value })}
            activeClassName="form-dropzone--active"
            acceptClassName="form-dropzone--accept"
            rejectClassName="form-dropzone--reject"
            disabledClassName="form-dropzone--disabled"
          />
          { value &&
            <div className="form-fields-file__preview">
              {this.props.children(value)}
            </div>
          }
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

export { FileInput };

export default connect(null, mapDispatchToProps)(FileInput);
