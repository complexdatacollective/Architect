import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import uuid from 'uuid';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import Icon from '@codaco/ui/lib/components/Icon';
import AssetBrowserWindow from '../../AssetBrowser/AssetBrowserWindow';

const withShowBrowser = withState(
  'showBrowser',
  'setShowBrowser',
  ({ showBrowser }) => !!showBrowser,
);

class FileInput extends PureComponent {
  static propTypes = {
    children: PropTypes.func,
    onChange: PropTypes.func,
    onCloseBrowser: PropTypes.func,
    showBrowser: PropTypes.bool.isRequired,
    setShowBrowser: PropTypes.func.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    selected: PropTypes.string,
    meta: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
  };

  static defaultProps = {
    value: '',
    label: '',
    className: null,
    selected: null,
    onChange: () => {},
    onCloseBrowser: () => {},
    type: null,
    children: value => value,
  };

  componentWillMount() {
    this.id = uuid();
  }

  closeBrowser() {
    this.props.setShowBrowser(false);
    this.props.onCloseBrowser();
  }

  openBrowser() {
    this.props.setShowBrowser(true);
  }

  handleBrowseLibrary = (e) => {
    e.stopPropagation();
    this.openBrowser();
  }

  handleBlurBrowser = () => {
    this.closeBrowser();
  }

  handleSelectAsset = (assetId) => {
    this.closeBrowser();
    this.props.input.onChange(assetId);
  }

  render() {
    const {
      input: { value },
      meta: { error, invalid, touched },
      showBrowser,
      label,
      type,
      selected,
      className,
    } = this.props;

    const fieldClasses = cx(
      'form-fields-file',
      className,
      'form-field-container',
      {
        'form-fields-file--replace': !!value,
        'form-fields-file--has-error': error,
      },
    );

    return (
      <div className={fieldClasses}>
        { label &&
          <h4 className="form-fields-file__label">{label}</h4>
        }
        {invalid && touched && <div className="form-fields-file__error"><Icon name="warning" />{error}</div>}
        <div className="form-fields-file__preview">
          {this.props.children(value)}
        </div>
        <div className="form-fields-file__browse">
          <Button
            onClick={this.handleBrowseLibrary}
            color="paradise-pink"
            size="small"
          >
            { !value ? 'Select asset' : 'Update asset' }
          </Button>
        </div>
        <AssetBrowserWindow
          show={showBrowser}
          type={type}
          selected={selected}
          onSelect={this.handleSelectAsset}
          onCancel={this.handleBlurBrowser}
        />
      </div>
    );
  }
}

export { FileInput };

export default withShowBrowser(FileInput);
