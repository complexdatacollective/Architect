import React from 'react';
import PropTypes from 'prop-types';
import { fieldArrayFieldsPropTypes } from 'redux-form';
import Button from '@codaco/ui/lib/components/Button';
import Attribute from './Attribute';
import withAssignAttributesHandlers from './withAssignAttributesHandlers';

const AssignAttributes = ({
  variableOptions,
  fields,
  type,
  entity,
  handleAddNew,
  handleCreateNewVariable,
  handleDelete,
  form,
}) => (
  <div className="assign-attributes">
    { fields.length > 0 && (
      <div className="assign-attributes__attributes">
        {fields.map((field, index) => (
          <Attribute
            key={field}
            index={index}
            entity={entity}
            type={type}
            form={form}
            field={field}
            variableOptions={variableOptions}
            onCreateNew={handleCreateNewVariable}
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
  </div>
);

const variableOption = PropTypes.shape({
  disabled: PropTypes.bool,
  isUsed: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
});

AssignAttributes.propTypes = {
  variableOptions: PropTypes.arrayOf(variableOption).isRequired,
  fields: PropTypes.shape(fieldArrayFieldsPropTypes).isRequired,
  type: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  handleAddNew: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export default withAssignAttributesHandlers(AssignAttributes);
