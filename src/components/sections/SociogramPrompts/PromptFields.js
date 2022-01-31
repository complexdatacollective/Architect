/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { compose } from 'recompose';
import PromptText from '@components/sections/PromptText';
import FieldsLayout from './PromptFieldsLayout';
import DisplayEdgesSection from './PromptFieldsEdges';
import TapBehaviourSection from './PromptFieldsTapBehaviour';
import withCanCreateEdgesState from './withCanCreateEdgesState';

// TODO no prop spreading
const PromptFields = (props) => (
  <div>
    <PromptText />
    <FieldsLayout {...props} />
    <TapBehaviourSection {...props} />
    <DisplayEdgesSection {...props} />
  </div>
);

export default compose(
  withCanCreateEdgesState,
)(PromptFields);
