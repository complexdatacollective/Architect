import {
  NodeType,
  Form,
  NameGeneratorPrompts,
  NodePanels,
  InterviewerScript,
} from '@components/sections';

const NameGenerator = {
  headerSections: [
    NodeType,
  ],
  sections: [
    Form,
    NameGeneratorPrompts,
    NodePanels,
    InterviewerScript,
  ],
  name: 'Name Generator (using forms)',
};

export default NameGenerator;
