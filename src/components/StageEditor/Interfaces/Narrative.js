import {
  Name,
  NodeType,
  Background,
  NarrativePresets,
  NarrativeBehaviours,
} from '@components/sections';

const Narrative = {
  sections: [
    Name,
    NodeType,
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
