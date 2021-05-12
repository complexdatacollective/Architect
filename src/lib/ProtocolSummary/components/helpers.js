/* eslint-disable import/prefer-default-export */
import React from 'react';

export const renderValue = (value) => {
  if (typeof value === 'boolean') {
    return value ? <em>TRUE</em> : <em>FALSE</em>;
  }

  return value;
};

export const getVariableName = (index, variableId) => {
  const entry = index.find(({ id }) => id === variableId);

  return entry && entry.name;
};
