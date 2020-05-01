import {
  Name,
  NodeType,
  ExternalDataSource,
  CardDisplayOptions,
  SortOptionsForExternalData,
  NameGeneratorListPrompts,
} from '@components/sections';

const NameGeneratorList = {
  sections: [
    Name,
    NodeType,
    ExternalDataSource,
    CardDisplayOptions,
    SortOptionsForExternalData,
    NameGeneratorListPrompts,
  ],
  name: 'Small Roster Name Generator',
};

export default NameGeneratorList;
