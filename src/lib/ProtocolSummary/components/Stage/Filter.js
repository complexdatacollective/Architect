import React from 'react';
import Rules from '../Rules';

const Filter = ({ filter }) => {
  if (!filter) { return null; }

  console.log({ filter });

  return (
    <div className="protocol-summary-stage__filter">
      <Rules filter={filter} />
    </div>
  );
};

export default Filter;
