import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Join } from '@components/Query/Rules/PreviewText';
import SummaryContext from './SummaryContext';
import Rule from './Rule';

const Rules = ({ filter }) => {
  const {
    protocol,
  } = useContext(SummaryContext);

  if (!filter) { return null; }

  const {
    join,
    rules,
  } = filter;

  return (
    <div className="protocol-summary-rules">
      { rules.map(({ type, options }, n) => (
        <>
          {/* eslint-disable-next-line react/no-array-index-key */}
          <div className="protocol-summary-rules__rule" key={n}>
            <Rule type={type} options={options} codebook={protocol.codebook} />
          </div>
          { n !== rules.length - 1 && join && <Join value={join} /> }
        </>
      ))}
    </div>
  );
};

Rules.propTypes = {
  filter: PropTypes.shape({
    join: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    rules: PropTypes.array,
  }),
};

Rules.defaultProps = {
  filter: null,
};

export default Rules;
