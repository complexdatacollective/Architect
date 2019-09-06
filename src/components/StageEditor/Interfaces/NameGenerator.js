import {
  Name,
  NodeType,
  Filter,
  Form,
  NameGeneratorPrompts,
  NodePanels,
} from '../../sections';

const NameGenerator = {
  sections: [
    Name,
    NodeType,
    Filter,
    Form,
    NameGeneratorPrompts,
    NodePanels,
  ],
  name: 'Name Generator (using forms)',
};

export default NameGenerator;
