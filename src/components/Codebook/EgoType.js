import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { compose } from 'recompose';
import { getType } from '@selectors/codebook';
import { utils, getVariableIndex } from '@selectors/indexes';
import Variables from './Variables';
import { getUsage, getUsageAsStageName } from './helpers';

const EgoType = ({
  variables,
}) => (
  <div className="codebook__entity">
    { variables.length > 0 &&
      <div className="codebook__entity-variables codebook__entity-variables--no-border">
        <h3>Variables:</h3>
        <Variables
          variables={variables}
          entity="ego"
        />
      </div>
    }
  </div>
);

EgoType.propTypes = {
  variables: PropTypes.array,
};

EgoType.defaultProps = {
  variables: [],
};

const mapStateToProps = (state) => {
  const {
    name,
    color,
    variables,
  } = getType(state, { entity: 'ego' });

  const variableIndex = getVariableIndex(state);
  const variableLookup = utils.buildSearch([variableIndex]);

  const variablesWithUsage = map(
    variables,
    (variable, id) => {
      const inUse = variableLookup.has(id);

      const usage = inUse ?
        getUsageAsStageName(state, getUsage(variableIndex, id)) :
        [];

      return ({
        ...variable,
        id,
        inUse,
        usage,
      });
    },
  );

  return {
    name,
    color,
    variables: variablesWithUsage,
  };
};

export { EgoType };

export default compose(
  connect(mapStateToProps),
)(EgoType);
