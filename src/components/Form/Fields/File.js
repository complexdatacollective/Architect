import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import AssetBrowser from '../../AssetBrowser';
import Button from '../../../ui/components/Button';
import Icon from '../../../ui/components/Icon';

class FileInput extends PureComponent {
  static propTypes = {
    children: PropTypes.func,
    onChange: PropTypes.func,
    type: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    meta: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    value: '',
    label: '',
    className: '',
    onChange: () => {},
    type: null,
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
      meta: { error, invalid, touched },
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
        <div className="form-fields-file__browse">
          <Button
            onClick={this.handleBrowseLibrary}
            color="paradise-pink"
          >
            { !value ? 'Select asset' : 'Update asset' }
          </Button>
        </div>
        {invalid && touched && <div className="form-field-text__error"><Icon name="warning" />{error}</div>}
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
