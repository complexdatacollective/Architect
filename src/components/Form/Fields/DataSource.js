import React from 'react';
import { fieldPropTypes } from 'redux-form';
import File from './File';

const DataSource = props => (
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

DataSource.propTypes = {
  ...fieldPropTypes,
};

export default DataSource;
