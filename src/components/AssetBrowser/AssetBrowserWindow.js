import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import window from '../../ui/components/window';
import Button from '../../ui/components/Button';
import SimpleDialog from '../../ui/components/Dialog/Simple';
import Stackable from '../../components/Stackable';
import AssetBrowser from './AssetBrowser';

const AssetBrowserWindow = ({
  show,
  type,
  onCancel,
  onSelect,
}) => {
  const cancelButton = [(
    <Button
      color="white"
      onClick={onCancel}
      key="cancel"
    >
      Cancel
    </Button>
  )];

  return (
    <Stackable stackKey={show}>
      {({ stackIndex }) => (
        <SimpleDialog
          show={show}
          onBlur={onCancel}
          title="Asset Browser"
          options={cancelButton}
          style={{
            zIndex: stackIndex + 10000,
          }}
          className="asset-browser__window"
        >
          <AssetBrowser
            type={type}
            onSelect={onSelect}
          />
        </SimpleDialog>
      )}
    </Stackable>
  );
};

AssetBrowserWindow.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
};

AssetBrowserWindow.defaultProps = {
  show: true,
  type: null,
  onSelect: () => {},
  onCancel: () => {},
  stackIndex: null,
};

export default compose(
  window,
)(AssetBrowserWindow);
