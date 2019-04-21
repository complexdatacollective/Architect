import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import window from '../../ui/components/window';
import Button from '../../ui/components/Button';
import SimpleDialog from '../../ui/components/Dialog/Simple';
import Stackable from '../../components/Stackable';
import Assets from './Assets';
import NewAsset from './NewAsset';
import withAssetActions from './withAssetActions';

const AssetBrowser = ({
  show,
  type,
  onCancel,
  onSelect,
  onDelete,
}) => {
  const cancelButton = (
    <Button
      color="white"
      onClick={onCancel}
    >
      Cancel
    </Button>
  );

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
          className="asset-browser"
        >
          <div className="asset-browser__content">
            <div className="asset-browser__create">
              <NewAsset
                onCreate={onSelect}
                type={type}
              />
            </div>
            <div className="asset-browser__assets">
              <h3>Choose asset from library</h3>
              <Assets
                onSelect={onSelect}
                onDelete={onDelete}
                type={type}
              />
            </div>
          </div>
        </SimpleDialog>
      )}
    </Stackable>
  );
};

AssetBrowser.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
};

AssetBrowser.defaultProps = {
  show: true,
  type: null,
  onSelect: () => {},
  onDelete: () => {},
  onCancel: () => {},
  stackIndex: null,
};

export default compose(
  withAssetActions,
  window,
)(AssetBrowser);
