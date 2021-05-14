import React from 'react';
import Rules from '../Rules';
import MiniTable from '../MiniTable';

const SkipLogic = ({ skipLogic }) => {
  if (!skipLogic) { return null; }

  const {
    filter,
    action,
  } = skipLogic;

  return (
    <div className="protocol-summary-stage__skip-logic">
      <MiniTable
        rows={[
          [<strong>Action</strong>, action],
          [<strong>Rules</strong>, <Rules filter={filter} />],
        ]}
        wide
      />
    </div>
  );
};

export default SkipLogic;
