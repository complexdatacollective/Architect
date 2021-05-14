import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Variable from '../Variable';
import MiniTable from '../MiniTable';
import SummaryContext from '../SummaryContext';

const QuickAdd = ({ quickAdd }) => {
  const {
    index,
  } = useContext(SummaryContext);

  if (!quickAdd) { return null; }

  const variableMeta = index.find(({ id }) => id === quickAdd);

  return (
    <div className="protocol-summary-stage__quick-add">
      <h2>Quick Add</h2>
      <div className="protocol-summary-stage__quick-add-content">
        <MiniTable
          rows={[
            [
              <strong>Variable</strong>,
              <Variable id={quickAdd} />,
            ],
            [
              <strong>Type</strong>,
              variableMeta.type,
            ],
          ]}
        />
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
