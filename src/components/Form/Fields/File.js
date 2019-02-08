import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';
import { actionCreators as assetActions } from '../../../ducks/modules/protocol/assetManifest';
import Dropzone from '../Dropzone';
import AssetBrowser from '../../AssetBrowser';

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

  constructor(props) {
    super(props);

    this.state = {
      assetBrowser: false,
    };
  }

  componentWillMount() {
    this.id = uniqueId('label');
  }

  toggleBrowser() {
    this.setState({ assetBrowser: !this.state.assetBrowser });
  }

  handleBrowseLibrary = (e) => {
    e.stopPropagation();
    this.toggleBrowser();
  }

  handleBlurBrowser = () => {
    this.toggleBrowser();
  }

  handleDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const type = this.props.type || file.type;
      this.props.importAsset(file, type)
        .then(({ id }) => {
          this.props.input.onChange(id);
        });
    });
  }

  handleSelectAsset = (assetId) => {
    this.toggleBrowser();
    this.props.input.onChange(assetId);
  }

  render() {
    const {
      input: { value },
      meta: { touched, invalid, error },
      accept,
      label,
      type,
      className,
    } = this.props;

    const { assetBrowser } = this.state;

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
        <div
          className={cx('form-fields-file__file', { 'form-fields-file__file--replace': !!value })}
        >
          <Dropzone
            onDrop={this.handleDrop}
            onBrowseLibrary={this.handleBrowseLibrary}
            value={value}
            accept={accept}
          >
            {this.props.children(value)}
          </Dropzone>
        </div>
        { touched && invalid && <p className="form-fields-mode__error">{error}</p> }
        <AssetBrowser
          show={assetBrowser}
          type={type}
          onSelectAsset={this.handleSelectAsset}
          onCancel={this.handleBlurBrowser}
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
