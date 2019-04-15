import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Button from '../../ui/components/Button';
import Attribute from './Attribute';
import withVariableOptions from './withVariableOptions';
import withNewVariableHandlers from './withNewVariableHandlers';
import NewVariableWindow from '../NewVariableWindow';

const AssignAttributes = ({
  variableOptions,
  fields,
  type,
  entity,
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
            type={type}
            entity={entity}
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
  openNewVariableWindow: PropTypes.func.isRequired,
  showNewVariableWindow: PropTypes.bool.isRequired,
  handleCreateNewVariable: PropTypes.func.isRequired,
  handleCancelCreateNewVariable: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

export { AssignAttributes };

export default compose(
  withVariableOptions,
  withNewVariableHandlers,
)(AssignAttributes);
