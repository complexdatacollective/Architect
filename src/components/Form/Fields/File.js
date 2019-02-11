import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';
import AssetBrowser from '../../AssetBrowser';
import Button from '../../../ui/components/Button';

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
    this.id = uuid();
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

  handleSelectAsset = (assetId) => {
    this.toggleBrowser();
    this.props.input.onChange(assetId);
  }

  render() {
    const {
      input: { value },
      meta: { touched, invalid, error },
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
        'form-fields-file--replace': !!value,
      },
    );

    return (
      <div className={fieldClasses}>
        { label &&
          <h4 className="form-fields-file__label">{label}</h4>
        }
        <div className="form-fields-file__preview">
          {this.props.children(value)}
        </div>
        <Button
          onClick={this.handleBrowseLibrary}
          color="paradise-pink"
        >
          { !value ? 'Select asset' : 'Update asset' }
        </Button>
        { touched && invalid && <p className="form-fields-mode__error">{error}</p> }
        <AssetBrowser
          show={assetBrowser}
          type={type}
          onSelect={this.handleSelectAsset}
          onCancel={this.handleBlurBrowser}
        />
      </div>
    );
  }
}

export { FileInput };

export default FileInput;
