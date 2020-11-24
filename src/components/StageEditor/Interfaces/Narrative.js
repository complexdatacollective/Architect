import {
  FilteredNodeType,
  Background,
  NarrativePresets,
  NarrativeBehaviours,
} from '@components/sections';

const Narrative = {
  headerSections: [
    FilteredNodeType,
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
