import {
  Name,
  NodeType,
  ExternalDataWithCardOptions,
  CardDisplayOptions,
  SortOptions,
  NameGeneratorListPrompts,
} from '../../sections';

const NameGeneratorList = {
  sections: [
    Name,
    NodeType,
    ExternalDataWithCardOptions,
    CardDisplayOptions,
    SortOptions,
    NameGeneratorListPrompts,
  ],
  name: 'Small Roster Name Generator',
  template: {
    showExistingNodes: false,
  },
};

export default NameGeneratorList;
