import {
  Name,
  NodeType,
  ShowExistingNodes,
  NameGeneratorListPrompts,
} from '../../sections';

const NameGeneratorList = {
  sections: [
    Name,
    NodeType,
    ShowExistingNodes,
    NameGeneratorListPrompts,
  ],
  name: 'Roster Name Generator (list)',
  template: {
    showExistingNodes: false,
  },
};

export default NameGeneratorList;
