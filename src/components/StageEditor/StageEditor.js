import React from 'react';
import {
  Title,
  ContentItems,
} from './sections';

/*
 * Renders the relevant interface editor
 */

// Example interface layout
const informationInterface = [
  Title,
  ContentItems,
];

const StageEditor = props => (
  <div className="edit-stage">
    {
      informationInterface.map((Section, index) =>
        <Section key={index} {...props} />)
    }
  </div>
);

export default StageEditor;
