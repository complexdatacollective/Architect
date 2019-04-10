/* eslint-disable */

import React, { Component } from 'react';
import { compose } from 'recompose';
import Button from '../../ui/components/Button';
import Attribute from './Attribute';
import withVariableOptions from './withVariableOptions';

class AssignAttributes extends Component {
  render() {
    const {
      variableOptions,
      fields,
      nodeType,
      form,
    } = this.props;

    return (
      <div className="assign-attributes">
        { fields.length > 0 && (
          <div className="assign-attributes__attributes">
            {fields.map((field, index, fields) => (
              <Attribute
                key={index}
                index={index}
                variableOptions={variableOptions}
                nodeType={nodeType}
                form={form}
                field={field}
                fields={fields}
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
      </div>
    );
  }
}

export { AssignAttributes };

export default compose(
  withVariableOptions,
)(AssignAttributes);
