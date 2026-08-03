import { Join } from '@components/Query/Rules/PreviewText';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import Rule from './Rule';
import SummaryContext from './SummaryContext';

const Rules = ({ filter }) => {
  const { protocol } = useContext(SummaryContext);

  if (!filter) {
    return null;
  }

  const { join, rules } = filter;

  return (
    <div className="protocol-summary-rules">
      {rules.map(({ type, options }, n) => (
        <>
          <div className="protocol-summary-rules__rule" key={n}>
            <Rule type={type} options={options} codebook={protocol.codebook} />
          </div>
          {n !== rules.length - 1 && join && <Join value={join} />}
        </>
      ))}
    </div>
  );
};

Rules.propTypes = {
  filter: PropTypes.shape({
    join: PropTypes.string,
    rules: PropTypes.array,
  }),
};

Rules.defaultProps = {
  filter: null,
};

export default Rules;
