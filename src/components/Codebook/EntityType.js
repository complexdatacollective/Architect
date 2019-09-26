import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, reduce } from 'lodash';
import { getType } from '@selectors/codebook';
import { utils, getVariableIndex } from '@selectors/indexes';
import { Button } from '@ui/components';
import Variables from './Variables';

const EntityIcon = () => (<div />);

const EntityType = ({ name, color, inUse, entity, type, variables, handleDelete }) => (
  <div>
    <div className="simple-list__item">
      <div className="simple-list__attribute simple-list__attribute--icon">
        <EntityIcon color={color} entity={entity} type={type} />
      </div>
      <div className="simple-list__attribute">
        <h3>
          {name}
        </h3>
        { !inUse && <div className="simple-list__tag">not in use</div> }
      </div>
      { !inUse &&
        <div className="simple-list__attribute simple-list__attribute--options">
          <Button size="small" color="neon-coral" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      }
    </div>
    <Variables
      variables={variables}
      entity={entity}
      type={type}
    />
  </div>
);

EntityType.propTypes = {
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  used: PropTypes.boolean,
  handleDelete: PropTypes.func.isRequired,
  variables: PropTypes.array,
};

EntityType.defaultProps = {
  variables: [],
  used: true, // Don't allow delete unless we explicitly say so
  handleDelete: () => {},
};

const mapStateToProps = (state, { entity, type }) => {
  const {
    name,
    color,
    variables,
  } = getType(state, { entity, type });

  const variableIndex = getVariableIndex(state);
  const variableLookup = utils.buildSearch([variableIndex]);

  const variablesWithUsage = map(
    variables,
    (variable, id) => {
      const inUse = variableLookup.has(id);

      const usage = inUse ?
        reduce(variableIndex, (acc, variableId, path) => {
          if (variableId !== id) { return acc; }
          return [...acc, path];
        }, []) :
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

const mapDispatchToProps = {
};

export { EntityType };

export default connect(mapStateToProps, mapDispatchToProps)(EntityType);
