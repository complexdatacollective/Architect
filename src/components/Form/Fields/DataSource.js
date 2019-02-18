import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';
import { fieldPropTypes } from 'redux-form';
import Radio from '../../../ui/components/Fields/Radio';
import NetworkAsset from '../../Assets/Network';
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

    const existingInput = {
      value: input.value === 'existing',
      onChange: this.handleClickUseExisting,
    };

    const networkAssetInput = {
      value: input.value !== 'existing',
      onClick: this.handleClickUseNetworkAsset,
    };

    const showNetworkAssetInput = selectNetworkAsset || input.value !== 'existing';

    return (
      <div className="form-fields-data-source">
        { canUseExisting &&
          <div className="form-field-data-source__options">
            <div className="form-fields-data-source__option">
              <Radio input={existingInput} label="Use network from interview" />
            </div>
            <div className="form-fields-data-source__option">
              <Radio input={networkAssetInput} label="Use network asset" />
              { showNetworkAssetInput &&
                <File
                  type="network"
                  showBrowser={selectNetworkAsset}
                  onCloseBrowser={this.handleCloseBrowser}
                  {...this.props}
                >
                  { id => <NetworkAsset id={id} /> }
                </File>
              }
            </div>
          </div>
        }
        { !canUseExisting &&
          <File
            type="network"
            {...this.props}
          >
            { id => <NetworkAsset id={id} /> }
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
