import React from 'react';
import Egg from './Egg';
import { appVersion, codename } from '../utils/appVersion';

const Version = () => (
  <Egg>
    <div className="version">
      <h1>{appVersion}</h1>
      <h2>{codename}</h2>
    </div>
  </Egg>
);

export default Version;
