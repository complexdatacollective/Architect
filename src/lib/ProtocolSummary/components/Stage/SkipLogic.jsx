/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
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
        rotated
        wide
        rows={[
          ['Action', action],
          ['Rules', <Rules filter={filter} />],
        ]}
      />
    </div>
  );
};

SkipLogic.propTypes = {
  skipLogic: PropTypes.object.isRequired,
};

export default SkipLogic;
