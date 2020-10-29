import {
  Name,
  NodeType,
  QuickAdd,
  NameGeneratorPrompts,
  NodePanels,
} from '@components/sections';

const NameGeneratorQuickAdd = {
  headerSections: [
    Name,
    NodeType,
  ],
  sections: [
    QuickAdd,
    NameGeneratorPrompts,
    NodePanels,
  ],
  name: 'Name Generator (quick add mode)',
};

export default NameGeneratorQuickAdd;
