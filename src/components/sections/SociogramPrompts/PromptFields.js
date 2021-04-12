/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { compose } from 'recompose';
import PromptText from '@components/sections/PromptText';
import FieldsLayout from './PromptFieldsLayout';
import FieldsHighlight from './PromptFieldsHighlight';
import FieldsEdges from './PromptFieldsEdges';
import withCanCreateEdgesState from './withCanCreateEdgesState';

// TODO no prop spreading
const PromptFields = (props) => (
  <div>
    <PromptText />
    <FieldsLayout {...props} />
    <FieldsEdges {...props} />
    <FieldsHighlight {...props} />
  </div>
);

export default compose(
  withCanCreateEdgesState,
)(PromptFields);
