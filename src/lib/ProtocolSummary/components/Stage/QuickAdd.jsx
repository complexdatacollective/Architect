import PropTypes from 'prop-types';
import { useContext } from 'react';

import MiniTable from '../MiniTable';
import SummaryContext from '../SummaryContext';
import Variable from '../Variable';

const QuickAdd = ({ quickAdd }) => {
  const { index } = useContext(SummaryContext);

  if (!quickAdd) {
    return null;
  }

  const variableMeta = index.find(({ id }) => id === quickAdd);

  return (
    <div className="protocol-summary-stage__quick-add">
      <div className="protocol-summary-stage__quick-add-content">
        <h2 className="section-heading">Quick Add</h2>
        <MiniTable
          rotated
          rows={[
            ['Variable', <Variable key={quickAdd} id={quickAdd} />],
            ['Type', variableMeta.type],
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
