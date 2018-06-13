import React from 'react';
import {
  Title,
  NodeType,
  Form,
  NameGeneratorPrompts,
  NodePanels,
} from '../sections';

const NameGenerator = {
  guidance: (
    <React.Fragment>
      <h3>Name Generator guidance</h3>
      <p>
        The Name Generator interface is designed to allow your research participants
        to name alters for later analysis.
      </p>
      <p>
        After giving your stage a descriptive title, you should determine the type
        of node that you wish to elicit. Either choose from your existing node types,
        or create a new one.
      </p>
      <p>
        For further help with configuring the Name Generator interface, please refer
        to our <a href={null}>Online Documentation</a>.
      </p>
    </React.Fragment>
  ),
  sections: [
    Title,
    NodeType,
    Form,
    NameGeneratorPrompts,
    NodePanels,
  ],
};

export default NameGenerator;
