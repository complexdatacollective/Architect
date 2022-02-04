import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import Icon from '@codaco/ui/lib/components/Icon';
import AssetBrowserWindow from '../../AssetBrowser/AssetBrowserWindow';

const withShowBrowser = withState(
  'showBrowser',
  'setShowBrowser',
  ({ showBrowser }) => !!showBrowser,
);

const FileInput = ({
  setShowBrowser,
  onCloseBrowser,
  input: { value, onChange },
  meta: { error, invalid, touched },
  showBrowser,
  label,
  type,
  selected,
  className,
  children,
}) => {
  const closeBrowser = () => {
    setShowBrowser(false);
    onCloseBrowser();
  };

  const openBrowser = () => {
    setShowBrowser(true);
  };

  const handleBrowseLibrary = (e) => {
    e.stopPropagation();
    openBrowser();
  };

  const handleBlurBrowser = () => {
    closeBrowser();
  };

  const handleSelectAsset = (assetId) => {
    closeBrowser();
    onChange(assetId);
  };

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
      { label
        && <h4 className="form-field-label">{label}</h4>}
      {invalid && touched && (
      <div className="form-fields-file__error">
        <Icon name="warning" />
        {error}
      </div>
      )}
      <div className="form-fields-file__preview">
        {children(value)}
      </div>
      <div className="form-fields-file__browse">
        <Button
          onClick={handleBrowseLibrary}
          color="primary"
          size="small"
        >
          { !value ? 'Select resource' : 'Update resource' }
        </Button>
      </div>
      <AssetBrowserWindow
        show={showBrowser}
        type={type}
        selected={selected}
        onSelect={handleSelectAsset}
        onCancel={handleBlurBrowser}
      />
    </div>
  );
};

FileInput.propTypes = {
  children: PropTypes.func,
  onChange: PropTypes.func,
  onCloseBrowser: PropTypes.func,
  showBrowser: PropTypes.bool.isRequired,
  setShowBrowser: PropTypes.func.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  selected: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.object.isRequired,
  value: PropTypes.string,
};

FileInput.defaultProps = {
  value: '',
  label: '',
  className: null,
  selected: null,
  onChange: () => {},
  onCloseBrowser: () => {},
  type: null,
  children: (value) => value,
};

export { FileInput };

export default withShowBrowser(FileInput);
