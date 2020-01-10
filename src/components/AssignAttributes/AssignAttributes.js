import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Attribute from './Attribute';
import withAssignAttributesHandlers from './withAssignAttributesHandlers';
import NewVariableWindow from '../NewVariableWindow';

const AssignAttributes = ({
  variableOptions,
  fields,
  type,
  entity,
  handleOpenCreateNew,
  showNewVariableWindow,
  handleAddNew,
  handleCreateNewVariable,
  handleCompleteCreateNewVariable,
  handleDelete,
  form,
}) => (
  <div className="assign-attributes">
    { fields.length > 0 && (
      <div className="assign-attributes__attributes">
        {fields.map((field, index) => (
          <Attribute
            key={index}
            index={index}
            type={type}
            entity={entity}
            form={form}
            field={field}
            variableOptions={variableOptions}
            onCreateNew={handleOpenCreateNew}
            onDelete={handleDelete}
          />
        ))}
      </div>
    ) }
    <div className="assign-attributes__add">
      <Button
        color="primary"
        icon="add"
        size="small"
        onClick={handleAddNew}
      >
        Add new variable to assign
      </Button>
    </div>

    <NewVariableWindow
      show={showNewVariableWindow}
      onComplete={handleCreateNewVariable}
      onCancel={handleCompleteCreateNewVariable}
      entity={entity}
      type={type}
    />
  </div>
);

AssignAttributes.propTypes = {
  variableOptions: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  handleOpenCreateNew: PropTypes.func.isRequired,
  showNewVariableWindow: PropTypes.bool.isRequired,
  handleAddNew: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  handleCompleteCreateNewVariable: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export { AssignAttributes };

export default withAssignAttributesHandlers(AssignAttributes);
