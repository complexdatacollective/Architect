import React from 'react';
import { fieldPropTypes } from 'redux-form';
import File from './File';

const NetworkFile = props => (
  <File
    type="network"
    {...props}
  >
    { id => (
      <div className="form-fields-network-file">
        {id}
      </div>
    ) }
  </File>
);

NetworkFile.propTypes = {
  ...fieldPropTypes,
};

export default NetworkFile;
