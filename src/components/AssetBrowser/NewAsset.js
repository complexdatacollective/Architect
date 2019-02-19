import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoFileDrop from '../Form/AutoFileDrop';

/**
 * Data source, which can be async or json file
 *
 * Value should be assetId
 */
class NewAsset extends Component {
  handleDrop = (assetId) => {
    this.props.onCreate(assetId);
  }

  render() {
    const {
      type,
    } = this.props;

    return (
      <div className="asset-browser-new-asset">
        <h3>Create new asset</h3>
        <AutoFileDrop
          type={type}
          onDrop={this.handleDrop}
        />
      </div>
    );
  }
}

NewAsset.propTypes = {
  type: PropTypes.string,
  onCreate: PropTypes.func,
};

NewAsset.defaultProps = {
  type: null,
  onCreate: () => {},
};

export { NewAsset };

export default NewAsset;
