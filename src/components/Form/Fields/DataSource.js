import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fieldPropTypes } from 'redux-form';
import Checkbox from '../../../ui/components/Fields/Checkbox';
import NetworkAsset from '../../Assets/Network';
import File from './File';

class DataSource extends Component {
  handleClickCheckbox = () => {
    if (this.props.input.value === 'existing') { return; }
    this.props.input.onChange('existing');
  }

  render() {
    const {
      canUseExisting,
      input,
    } = this.props;

    const checkboxInput = {
      value: input.value === 'existing',
      onChange: this.handleClickCheckbox,
    };

    return (
      <div>
        { canUseExisting &&
          <Checkbox
            label="Use network from interview"
            input={checkboxInput}
          />
        }

        <File
          type="network"
          {...this.props}
        >
          { id => <NetworkAsset id={id} /> }
        </File>
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

export default DataSource;
