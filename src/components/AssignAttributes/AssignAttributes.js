import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Button from '../../ui/components/Button';
import Attribute from './Attribute';
import withAssignAttributesOptions from './withAssignAttributesOptions';
import withAssignAttributesHandlers from './withAssignAttributesHandlers';
import NewVariableWindow from './NewVariableWindow';

const AssignAttributes = ({
  variableOptions,
  fields,
  nodeType,
  openNewVariableWindow,
  showNewVariableWindow,
  handleCreateNewVariable,
  handleCancelCreateNewVariable,
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
            nodeType={nodeType}
            form={form}
            field={field}
            fields={fields}
            onCreateNew={() => openNewVariableWindow(index)}
          />
        ))}
      </div>
    ) }

    { fields.length === 0 &&
      <p className="assign-attributes__empty">
        No attributes currently defined. Use the button below to create one.
      </p>
    }

    <div className="assign-attributes__add">
      <Button
        color="primary"
        icon="add"
        size="small"
        onClick={() => fields.push({ variable: null, value: null })}
      >
        Assign new attribute
      </Button>
    </div>

    <NewVariableWindow
      show={showNewVariableWindow}
      onSubmit={handleCreateNewVariable}
      onCancel={handleCancelCreateNewVariable}
      nodeType={nodeType}
    />
  </div>
);

AssignAttributes.propTypes = {
  variableOptions: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  nodeType: PropTypes.string.isRequired,
  openNewVariableWindow: PropTypes.func.isRequired,
  showNewVariableWindow: PropTypes.bool.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  handleCancelCreateNewVariable: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export { AssignAttributes };

export default compose(
  withAssignAttributesOptions,
  withAssignAttributesHandlers,
)(AssignAttributes);
