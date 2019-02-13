import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import window from '../../ui/components/window';
import Button from '../../ui/components/Button';
import BasicDialog from '../../ui/components/Dialog/Basic';
import Stackable from '../../components/Stackable';
import Assets from './Assets';
import NewAsset from './NewAsset';

const AssetBrowser = ({
  show,
  type,
  onCancel,
  onSelect,
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
        <BasicDialog
          show={show}
          onBlur={onCancel}
          zIndex={stackIndex + 10000}
          title="Asset Browser"
          options={cancelButton}
        >
          <div className="asset-browser">
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
                type={type}
              />
            </div>
          </div>
        </BasicDialog>
      )}
    </Stackable>
  );
};

AssetBrowser.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
};

AssetBrowser.defaultProps = {
  show: true,
  type: null,
  onSelect: () => {},
  onCancel: () => {},
  stackIndex: null,
};

export default compose(
  window,
)(AssetBrowser);
