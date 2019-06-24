import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/components/Button';
import Attribute from './Attribute';
import withAssignAttributesHandlers from './withAssignAttributesHandlers';
import NewVariableWindow from '../NewVariableWindow';

const AssignAttributes = ({
  variableOptions,
  fields,
  type,
  entity,
  handleCreateNew,
  showNewVariableWindow,
  handleCreateNewVariable,
  handleCancelCreateNewVariable,
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
            variableOptions={variableOptions}
            onDelete={handleDelete}
            type={type}
            entity={entity}
            form={form}
            field={field}
            fields={fields}
            onCreateNew={handleCreateNew}
          />
        ))}
      </div>
    ) }
    <div className="assign-attributes__add">
      <Button
        color="primary"
        icon="add"
        size="small"
        onClick={() => fields.push({})}
      >
        Add new variable to assign
      </Button>
    </div>

    <NewVariableWindow
      show={showNewVariableWindow}
      onComplete={handleCreateNewVariable}
      onCancel={handleCancelCreateNewVariable}
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
  handleCreateNew: PropTypes.func.isRequired,
  showNewVariableWindow: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  handleCancelCreateNewVariable: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export { AssignAttributes };

export default withAssignAttributesHandlers(AssignAttributes);
