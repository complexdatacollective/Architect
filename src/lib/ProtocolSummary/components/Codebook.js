import React from 'react';

import { useSelector } from 'react-redux';
import { getActiveProtocol } from '@selectors/session';

const Codebook = () => {
  const activeProtocol = useSelector(getActiveProtocol);

  return (
    <h2>Codebook</h2>
  );
};
