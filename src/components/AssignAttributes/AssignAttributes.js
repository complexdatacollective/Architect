import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';
import Attribute from './Attribute';
import withAssignAttributesHandlers from './withAssignAttributesHandlers';

const AssignAttributes = (props) => {
  const {
    variableOptions,
    fields,
    type,
    entity,
    handleAddNew,
    handleCreateNewVariable,
    handleDelete,
    form,
  } = props;

  return (
    <div className="assign-attributes">
      { fields.length > 0 && (
        <div className="assign-attributes__attributes">
          {fields.map((field, index) => (
            <Attribute
              key={index}
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
};

AssignAttributes.propTypes = {
  variableOptions: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  handleAddNew: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export { AssignAttributes };

export default withAssignAttributesHandlers(AssignAttributes);
