import React from 'react';
import { fieldPropTypes } from 'redux-form';
import File from './File';

const NetworkFile = props => (
  <File
    accept="application/json"
    {...props}
  >
    { url => (
      <div className="form-fields-network-file">
        {url}
      </div>
    ) }
  </File>
);

NetworkFile.propTypes = {
  ...fieldPropTypes,
};

export default NetworkFile;
