import {
  Name,
  NodeType,
  ExternalDataSource,
  CardDisplayOptions,
  SortOptionsForExternalData,
  NameGeneratorListPrompts,
} from '@components/sections';

const NameGeneratorList = {
  headerSections: [
    Name,
    NodeType,
  ],
  sections: [
    ExternalDataSource,
    CardDisplayOptions,
    SortOptionsForExternalData,
    NameGeneratorListPrompts,
  ],
  name: 'Small Roster Name Generator',
};

export default NameGeneratorList;
