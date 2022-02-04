import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import { fieldPropTypes } from 'redux-form';
import Radio from '@codaco/ui/lib/components/Fields/Radio';
import NetworkThumbnail from '@components/Thumbnail/Network';
import File from './File';

const withSelectNetworkAsset = withState('selectNetworkAsset', 'setSelectNetworkAsset', false);

const DataSource = (props) => {
  const {
    input,
    setSelectNetworkAsset,
    canUseExisting,
    selectNetworkAsset,
  } = props;

  const handleClickUseExisting = () => {
    if (input.value === 'existing') { return; }
    input.onChange('existing');
  };

  const handleClickUseNetworkAsset = () => {
    // if (this.props.input.value === 'existing') { return; }
    // this.props.input.onChange('existing');
    setSelectNetworkAsset(true);
  };

  const handleCloseBrowser = () => {
    setSelectNetworkAsset(false);
  };

  const isInterviewNetwork = input.value === 'existing';
  const showNetworkAssetInput = selectNetworkAsset || !isInterviewNetwork;

  const existingInput = {
    value: input.value && isInterviewNetwork,
    onChange: handleClickUseExisting,
  };

  const networkAssetInput = {
    value: input.value && !isInterviewNetwork,
    onChange: () => {},
    onClick: handleClickUseNetworkAsset,
  };

  return (
    canUseExisting ? (
      <div className="form-field-data-source">
        <div className="form-fields-data-source__option">
          <Radio input={existingInput} label="Use the network from the in-progress interview" />
        </div>
        <div className="form-fields-data-source__option">
          <Radio input={networkAssetInput} label="Use a network data file" />
          { showNetworkAssetInput
            && (
              <div className="form-fields-data-source__option-file">
                <File
                  type="network"
                  showBrowser={selectNetworkAsset}
                  onCloseBrowser={handleCloseBrowser}
                  selected={input.value}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                >
                  { (id) => <NetworkThumbnail id={id} /> }
                </File>
              </div>
            )}
        </div>
      </div>
    ) : (
      <File
        type="network"
        selected={input.value}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        { (id) => <NetworkThumbnail id={id} /> }
      </File>
    )
  );
};

DataSource.propTypes = {
  ...fieldPropTypes,
  canUseExisting: PropTypes.bool,
};

DataSource.defaultProps = {
  canUseExisting: false,
};

export default withSelectNetworkAsset(DataSource);
