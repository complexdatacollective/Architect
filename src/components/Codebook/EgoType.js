import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Variables from './Variables';
import { getEntityProperties } from './helpers';

const EgoType = ({
  variables,
}) => (
  <div className="codebook__entity">
    {variables.length > 0
      && (
        <div className="codebook__entity-variables codebook__entity-variables--no-border">
          <h3>Variables:</h3>
          <Variables
            variables={variables}
            entity="ego"
          />
        </div>
      )}
  </div>
);

EgoType.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.array,
};

EgoType.defaultProps = {
  variables: [],
};

const mapStateToProps = (state) => {
  const entityProperties = getEntityProperties(state, { entity: 'ego' });
  return entityProperties;
};

export default compose(
  connect(mapStateToProps),
)(EgoType);
