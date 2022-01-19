/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import {
  Background,
  CardDisplayOptions,
  CategoricalBinPrompts,
  ContentGrid,
  DyadCensusPrompts,
  ExternalDataSource,
  AutomaticLayout,
  FilteredEdgeType,
  FilteredNodeType,
  Form,
  InterviewScript,
  IntroductionPanel,
  NameGeneratorRosterPrompts,
  NameGeneratorPrompts,
  NarrativeBehaviours,
  NarrativePresets,
  NodePanels,
  NodeType,
  OrdinalBinPrompts,
  QuickAdd,
  SearchOptionsForExternalData,
  SociogramPrompts,
  SortOptionsForExternalData,
  SkipLogic,
  TieStrengthCensusPrompts,
  Title,
} from '@components/sections';

const AlterEdgeForm = {
  sections: [
    FilteredEdgeType,
    IntroductionPanel,
    Form,
    SkipLogic,
    InterviewScript,
  ],
  template: {},
};

const AlterForm = {
  sections: [
    FilteredNodeType,
    IntroductionPanel,
    Form,
    SkipLogic,
    InterviewScript,
  ],
};

const CategoricalBin = {
  sections: [
    FilteredNodeType,
    CategoricalBinPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const DyadCensus = {
  sections: [
    FilteredNodeType,
    IntroductionPanel,
    DyadCensusPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const EgoForm = {
  sections: [
    IntroductionPanel,
    Form,
    SkipLogic,
    InterviewScript,
  ],
  template: {},
};

const Information = {
  sections: [
    Title,
    ContentGrid,
    SkipLogic,
    InterviewScript,
  ],
};

const NameGenerator = {
  sections: [
    NodeType,
    Form,
    NameGeneratorPrompts,
    NodePanels,
    SkipLogic,
    InterviewScript,
  ],
  name: 'Name Generator (using forms)',
};

const NameGeneratorRoster = {
  sections: [
    NodeType,
    ExternalDataSource,
    CardDisplayOptions,
    SortOptionsForExternalData,
    SearchOptionsForExternalData,
    NameGeneratorRosterPrompts,
    SkipLogic,
    InterviewScript,
  ],
  name: 'Name Generator for Roster Data',
};

const NameGeneratorQuickAdd = {
  sections: [
    NodeType,
    QuickAdd,
    NameGeneratorPrompts,
    NodePanels,
    SkipLogic,
    InterviewScript,
  ],
  name: 'Name Generator (quick add mode)',
};

const Narrative = {
  sections: [
    FilteredNodeType,
    Background,
    NarrativePresets,
    NarrativeBehaviours,
    SkipLogic,
    InterviewScript,
  ],
  template: {
    behaviours: {
      allowRepositioning: true,
    },
  },
};

const OrdinalBin = {
  sections: [
    FilteredNodeType,
    OrdinalBinPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const Sociogram = {
  sections: [
    FilteredNodeType,
    Background,
    AutomaticLayout,
    SociogramPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const TieStrengthCensus = {
  sections: [
    FilteredNodeType,
    IntroductionPanel,
    TieStrengthCensusPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const interfaces = {
  AlterEdgeForm,
  AlterForm,
  CategoricalBin,
  DyadCensus,
  EgoForm,
  Information,
  NameGenerator,
  NameGeneratorRoster,
  NameGeneratorQuickAdd,
  Narrative,
  OrdinalBin,
  Sociogram,
  TieStrengthCensus,
};

const emptyInterface = {
  sections: [],
  template: {},
};

export const getInterface = (interfaceType) => get(interfaces, interfaceType, emptyInterface);
