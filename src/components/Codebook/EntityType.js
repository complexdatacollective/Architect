import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actionCreators as codebookActionCreators } from '@modules/protocol/codebook';
import { actionCreators as dialogActionCreators } from '@modules/dialogs';
import { actionCreators as screenActionsCreators } from '@modules/ui/screens';
import { Button } from '@codaco/ui/lib/components';
import ScreenLink from '@components/Screens/ScreenLink';
import Variables from './Variables';
import Tag from './Tag';
import EntityIcon from './EntityIcon';
import { getEntityProperties } from './helpers';

const EntityType = ({
  name,
  color,
  inUse,
  usage,
  entity,
  type,
  variables,
  handleEdit,
  handleDelete,
}) => {
  const stages = usage
    .map(({ id, label }) => (
      <ScreenLink screen="stage" id={id} key={id}>{label}</ScreenLink>
    ));

  return (
    <div className="codebook__entity">
      <div className="codebook__entity-detail">
        <div className="codebook__entity-icon">
          <EntityIcon color={color} entity={entity} type={type} />
        </div>
        <div className="codebook__entity-name">
          <h2>
            {name}
          </h2>
        </div>
        <div className="codebook__entity-meta">
          {!inUse && <Tag>not in use</Tag>}
          {inUse && (
            <>
              <em>used in:</em>
              {' '}
              {stages}
            </>
          )}
        </div>
        <div className="codebook__entity-control">
          <Button
            size="small"
            onClick={handleEdit}
          >
            Edit entity
          </Button>
          <Button
            size="small"
            color="neon-coral"
            onClick={handleDelete}
          >
            Delete entity
          </Button>
        </div>
      </div>
      {variables.length > 0
        && (
          <div className="codebook__entity-variables">
            <h3>Variables:</h3>
            <Variables
              variables={variables}
              entity={entity}
              type={type}
            />
          </div>
        )}
    </div>
  );
};

EntityType.propTypes = {
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  usage: PropTypes.array.isRequired,
  inUse: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.array,
};

EntityType.defaultProps = {
  variables: [],
  inUse: true, // Don't allow delete unless we explicitly say so
  handleDelete: () => { },
  handleEdit: () => { },
};

const mapStateToProps = (state, { entity, type }) => {
  const entityProperties = getEntityProperties(state, { entity, type });

  return entityProperties;
};

const withEntityHandlers = compose(
  connect(null, {
    openDialog: dialogActionCreators.openDialog,
    deleteType: codebookActionCreators.deleteType,
    closeScreen: screenActionsCreators.closeScreen,
    openScreen: screenActionsCreators.openScreen,
  }),
  withHandlers({
    handleEdit: ({ openScreen, entity, type }) => () => {
      openScreen('type', { entity, type });
    },
    handleDelete: ({
      deleteType, openDialog, entity, type, name, inUse,
    }) => () => {
      if (inUse) {
        openDialog({
          type: 'Notice',
          title: `Cannot delete ${name} ${entity}`,
          message: (
            <p>
              The
              {' '}
              {name}
              {' '}
              {entity}
              {' '}
              cannot be deleted as it is currently in use.
            </p>
          ),
        });

        return;
      }

      openDialog({
        type: 'Warning',
        title: `Delete ${name} ${entity}`,
        message: (
          <p>
            Are you sure you want to delete the
            {' '}
            {name}
            {' '}
            {entity}
            ? This cannot be undone.
          </p>
        ),
        onConfirm: () => deleteType(entity, type),
        confirmLabel: `Delete ${name} ${entity}`,
      });
    },
  }),
);

export default compose(
  connect(mapStateToProps),
  withEntityHandlers,
)(EntityType);
