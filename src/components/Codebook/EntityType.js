import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, reduce } from 'lodash';
import { compose, withHandlers } from 'recompose';
import { actionCreators as codebookActionCreators } from '@modules/protocol/codebook';
import { actionCreators as dialogActionCreators } from '@modules/dialogs';
import { getType } from '@selectors/codebook';
import { utils, getVariableIndex } from '@selectors/indexes';
import { Button, Icon, Node } from '@ui/components';
import Variables from './Variables';

const EntityIcon = ({ entity, color }) => {
  switch (entity) {
    case 'node':
      return <Node label="" color={color} />;
    case 'edge':
      return <Icon name="links" color={color} />
    default:
      return `No icon found for ${entity}.`;
  }
};

const EntityType = ({ name, color, inUse, entity, type, variables, handleDelete }) => (
  <div className="codebook__entity">
    <div className="codebook__entity-icon">
      <EntityIcon color={color} entity={entity} type={type} />
    </div>
    <div className="codebook__entity-detail">
      <div className="codebook__entity-meta">
        <h2>
          {name}
        </h2>
        { !inUse &&
          <Button
            size="small"
            color="neon-coral"
            onClick={handleDelete}
          >
            Delete
          </Button>
        }
      </div>
      <div className="codebook__entity-variables">
        <h3>Variables</h3>
        <Variables
          variables={variables}
          entity={entity}
          type={type}
        />
      </div>
    </div>
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

const withEntityHandlers = compose(
  connect(null, {
    openDialog: dialogActionCreators.openDialog,
    deleteType: codebookActionCreators.deleteType,
  }),
  withHandlers({
    handleDelete: ({ deleteType, openDialog, entity, type, name }) =>
      () => {
        openDialog({
          type: 'Warning',
          title: `Delete ${name} ${entity}`,
          message: (
            <p>
              Are you sure you want to delete the {name} {entity}? This cannot be undone.
            </p>
          ),
          onConfirm: () => { deleteType(entity, type); },
          confirmLabel: `Delete ${name} ${entity}`,
        });
      },
  }),
);

export { EntityType };

export default compose(
  connect(mapStateToProps),
  withEntityHandlers,
)(EntityType);
