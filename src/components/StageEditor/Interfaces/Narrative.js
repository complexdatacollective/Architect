import {
  Name,
  NodeType,
  Background,
  NarrativePresets,
  NarrativeBehaviours,
} from '@components/sections';

const Narrative = {
  headerSections: [
    Name,
    NodeType,
  ],
  sections: [
    Background,
    NarrativePresets,
    NarrativeBehaviours,
  ],
  template: {
    behaviours: {
      allowRepositioning: true,
    },
  },
};

export default Narrative;
