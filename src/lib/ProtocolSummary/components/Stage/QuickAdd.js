import React from 'react';
import PropTypes from 'prop-types';

const QuickAdd = ({ quickAdd }) => {
  if (!quickAdd) { return null; }

  return (
    <div className="protocol-summary-stage__quick-add">
      <h2>QuickAdd</h2>
    </div>
  );
};

QuickAdd.propTypes = {
};

QuickAdd.defaultProps = {
};

export default QuickAdd;
