import {
  NodeType,
  Form,
  NameGeneratorPrompts,
  NodePanels,
  InterviewScript,
} from '@components/sections';

const NameGenerator = {
  headerSections: [
    NodeType,
  ],
  sections: [
    InterviewScript,
    Form,
    NameGeneratorPrompts,
    NodePanels,
  ],
  name: 'Name Generator (using forms)',
};

export default NameGenerator;
