import React from 'react';
import { appVersion, codename } from '../utils/appVersion';

const Version = () => (
  <div className="version">
    <h4>
      {appVersion}
      {' '}
      {codename && (
      <span>
        -
        {codename}
      </span>
      )}
    </h4>
  </div>
);

export default Version;
