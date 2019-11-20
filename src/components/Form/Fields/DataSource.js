import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';
import Radio from '@ui/components/Fields/Radio';
import NetworkThumbnail from '@components/Thumbnail/Network';
import File from './File';

const withSelectNetworkAsset = withState('selectNetworkAsset', 'setSelectNetworkAsset', false);

class DataSource extends Component {
  handleClickUseExisting = () => {
    if (this.props.input.value === 'existing') { return; }
    this.props.input.onChange('existing');
  }

  handleClickUseNetworkAsset = () => {
    // if (this.props.input.value === 'existing') { return; }
    // this.props.input.onChange('existing');
    this.props.setSelectNetworkAsset(true);
  }

  handleCloseBrowser = () => {
    this.props.setSelectNetworkAsset(false);
  }

  render() {
    const {
      canUseExisting,
      selectNetworkAsset,
      input,
    } = this.props;

    const isInterviewNetwork = input.value === 'existing';
    const showNetworkAssetInput = selectNetworkAsset || !isInterviewNetwork;

    const existingInput = {
      value: input.value && isInterviewNetwork,
      onChange: this.handleClickUseExisting,
    };

    const networkAssetInput = {
      value: input.value && !isInterviewNetwork,
      onClick: this.handleClickUseNetworkAsset,
    };

    return (
      <div className="form-fields-data-source">
        { canUseExisting &&
          <div className="form-field-data-source__options">
            <div className="form-fields-data-source__option">
              <Radio input={existingInput} label="Use the network from the in-progress interview" />
            </div>
            <div className="form-fields-data-source__option">
              <Radio input={networkAssetInput} label="Use a network data file" />
              <div
                className={cx(
                  'form-fields-data-source__option-file',
                  { 'form-fields-data-source__option-file--hide': !networkAssetInput.value },
                )}
              >
                { showNetworkAssetInput &&
                  <File
                    type="network"
                    showBrowser={selectNetworkAsset}
                    onCloseBrowser={this.handleCloseBrowser}
                    selected={input.value}
                    {...this.props}
                  >
                    { id => <NetworkThumbnail id={id} /> }
                  </File>
                }
              </div>
            </div>
          </div>
        }
        { !canUseExisting &&
          <File
            type="network"
            selected={input.value}
            {...this.props}
          >
            { id => <NetworkThumbnail id={id} /> }
          </File>
        }
      </div>
    );
  }
}

DataSource.propTypes = {
  ...fieldPropTypes,
  canUseExisting: PropTypes.bool,
};

DataSource.defaultProps = {
  canUseExisting: false,
};

export { DataSource };

export default withSelectNetworkAsset(DataSource);
