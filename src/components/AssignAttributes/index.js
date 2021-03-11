import React from 'react';
import { FieldArray } from 'redux-form';
import AssignAttributes from './AssignAttributes';

const AssignAttributesContainer = (props) => (
  <FieldArray
    component={AssignAttributes}
    {...props}
  />
);

export default AssignAttributesContainer;
