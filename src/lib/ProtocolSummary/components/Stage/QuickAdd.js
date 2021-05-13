import React from 'react';
import PropTypes from 'prop-types';
import Variable from '../Variable';
import MiniTable from '../MiniTable';

const QuickAdd = ({ quickAdd }) => {
  if (!quickAdd) { return null; }

  return (
    <div className="protocol-summary-stage__quick-add">
      <h2>Quick Add</h2>
      <div className="protocol-summary-stage__quick-add-content">
        <MiniTable rows={[['Quick variable', <Variable id={quickAdd} />]]} />
      </div>
    </div>
  );
};

QuickAdd.propTypes = {
  quickAdd: PropTypes.string,
};

QuickAdd.defaultProps = {
  quickAdd: null,
};

export default QuickAdd;
