import {
  Name,
  NodeType,
  ExternalDataWithCardOptions,
  CardDisplayOptions,
  SearchOptions,
  NameGeneratorAutoCompletePrompts,
} from '../../sections';

const NameGeneratorAutoComplete = {
  sections: [
    Name,
    NodeType,
    ExternalDataWithCardOptions,
    CardDisplayOptions,
    SearchOptions,
    NameGeneratorAutoCompletePrompts,
  ],
  name: 'Large Roster Name Generator',
};

export default NameGeneratorAutoComplete;
