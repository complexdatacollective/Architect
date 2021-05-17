import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RuleText, { Join } from '@components/Query/Rules/PreviewText';
import SummaryContext from './SummaryContext';
import { getVariableName, getEntityName } from './helpers';

const labelRules = (codebook, index, rules) => rules
  .map(({ type, options }) => {
    const labeledOptions = {
      ...options,
    };

    if (options.attribute) {
      labeledOptions.attribute = getVariableName(index, options.attribute);
    }

    if (options.type) {
      const entity = type === 'alter' ? 'node' : 'edge';
      labeledOptions.type = getEntityName(codebook, entity, options.type);
    }

    return { type, options: labeledOptions };
  });

const Rules = ({ filter }) => {
  const {
    protocol,
    index,
  } = useContext(SummaryContext);

  if (!filter) { return null; }

  const {
    join,
  } = filter;

  // console.log({ rules: filter.rules });

  const rules = labelRules(protocol.codebook, index, filter.rules);

  return (
    <div className="protocol-summary-rules">
      { rules.map(({ type, options }, n) => (
        <div className="protocol-summary-rules__rule">
          <RuleText type={type} options={options} />
          { n !== rules.length - 1 && join && <Join value={join} /> }
        </div>
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
