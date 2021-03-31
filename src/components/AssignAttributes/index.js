import React from 'react';
import { FieldArray } from 'redux-form';
import AssignAttributes from './AssignAttributes';

const AssignAttributesContainer = (props) => (
  <FieldArray
    component={AssignAttributes}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export default AssignAttributesContainer;
