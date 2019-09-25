import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { getType } from '@selectors/codebook';
import { utils, getVariableIndex } from '@selectors/indexes';
import { Button } from '@ui/components';
import Variables from './Variables';


// handleDelete = (entity, type) => {
//   const typeName = this.props.codebook[entity][type].name;

//   this.props.openDialog({
//     type: 'Warning',
//     title: `Delete ${typeName} ${entity}`,
//     message: (
//       <p>
//         Are you sure you want to delete the {entity} called {typeName}? This cannot be undone.
//       </p>
//     ),
//     onConfirm: () => { this.props.deleteType(entity, type, true); },
//     confirmLabel: `Delete ${typeName} ${entity}`,
//   });
// };

const EntityIcon = () => (<div />);

const EntityType = ({ name, color, used, entity, type, variables, handleDelete }) => (
  <div>
    <div className="simple-list__item">
      <div className="simple-list__attribute simple-list__attribute--icon">
        <EntityIcon color={color} entity={entity} type={type} />
      </div>
      <div className="simple-list__attribute">
        <h3>
          {name}
        </h3>
        { !used && <div className="simple-list__tag">unused</div> }
      </div>
      { !used &&
        <div className="simple-list__attribute simple-list__attribute--options">
          <Button size="small" color="neon-coral" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      }
    </div>
    <Variables variables={variables} />
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
    (variable, id) =>
      ({ ...variable, isUsed: variableLookup.has(id) }),
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
