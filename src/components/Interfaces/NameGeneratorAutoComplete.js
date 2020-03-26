import {
  Name,
  NodeType,
  ExternalDataSource,
  CardDisplayOptions,
  SearchOptionsForExternalData,
  NameGeneratorAutoCompletePrompts,
} from '../../sections';

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
