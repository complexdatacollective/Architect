import {
  NodeType,
  Form,
  NameGeneratorPrompts,
  NodePanels,
} from '@components/sections';

const NameGenerator = {
  headerSections: [
    NodeType,
  ],
  sections: [
    Form,
    NameGeneratorPrompts,
    NodePanels,
  ],
  name: 'Name Generator (using forms)',
};

export default NameGenerator;
