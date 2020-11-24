import {
  NodeType,
  ExternalDataSource,
  CardDisplayOptions,
  SearchOptionsForExternalData,
  NameGeneratorAutoCompletePrompts,
} from '@components/sections';

const NameGeneratorAutoComplete = {
  headerSections: [
    NodeType,
  ],
  sections: [
    ExternalDataSource,
    CardDisplayOptions,
    SearchOptionsForExternalData,
    NameGeneratorAutoCompletePrompts,
  ],
  name: 'Large Roster Name Generator',
};

export default NameGeneratorAutoComplete;
