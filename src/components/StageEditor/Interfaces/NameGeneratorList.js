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
  name: 'Small Roster Name Generator',
  template: {
    showExistingNodes: false,
  },
};

export default NameGeneratorList;
