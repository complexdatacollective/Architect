import {
  Name,
  NodeType,
  ExternalDataSource,
  CardDisplayOptions,
  SearchOptionsForExternalData,
  NameGeneratorAutoCompletePrompts,
} from '@components/sections';

const NameGeneratorAutoComplete = {
  sections: [
    Name,
    NodeType,
    ExternalDataSource,
    CardDisplayOptions,
    SearchOptionsForExternalData,
    NameGeneratorAutoCompletePrompts,
  ],
  name: 'Large Roster Name Generator',
};

export default NameGeneratorAutoComplete;
