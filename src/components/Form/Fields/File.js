import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';
import { actionCreators as assetActions } from '../../../ducks/modules/protocol/assetManifest';

class FileInput extends PureComponent {
  static propTypes = {
    importAsset: PropTypes.func.isRequired,
    accept: PropTypes.string,
    children: PropTypes.func,
    label: PropTypes.string,
    className: PropTypes.string,
    ...fieldPropTypes,
  };

  static defaultProps = {
    value: '',
    meta: { invalid: false, error: null, touched: false },
    accept: '',
    label: '',
    className: '',
    children: value => value,
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const type = this.props.type || file.type;
      this.props.importAsset(file, type)
        .then(({ id }) => {
          this.props.input.onChange(id);
        });
    });
  }

  render() {
    const {
      input: { value },
      meta: { touched, invalid, error },
      accept,
      label,
      className,
    } = this.props;

    const fieldClasses = cx(
      'form-fields-file',
      className,
      'form-field-container',
      {
        'form-fields-mode--has-error': touched && invalid,
        'form-fields-file--complete': !!value,
      },
    );

    return (
      <div className={fieldClasses}>
        { label &&
          <h4 className="form-fields-file__label">{label}</h4>
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
        { touched && invalid && <p className="form-fields-mode__error">{error}</p> }
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

export { FileInput };

export default connect(null, mapDispatchToProps)(FileInput);
