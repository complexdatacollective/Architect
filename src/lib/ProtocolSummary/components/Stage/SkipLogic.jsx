import PropTypes from 'prop-types';

import MiniTable from '../MiniTable';
import Rules from '../Rules';

const SkipLogic = ({ skipLogic }) => {
  if (!skipLogic) {
    return null;
  }

  const { filter, action } = skipLogic;

  return (
    <div className="protocol-summary-stage__skip-logic">
      <MiniTable
        rotated
        wide
        rows={[
          ['Action', action],
          ['Rules', <Rules key="rules" filter={filter} />],
        ]}
      />
    </div>
  );
};

SkipLogic.propTypes = {
  skipLogic: PropTypes.object.isRequired,
};

export default SkipLogic;
