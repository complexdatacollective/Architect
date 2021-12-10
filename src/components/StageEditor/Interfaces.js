/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import {
  Background,
  CardDisplayOptions,
  CategoricalBinPrompts,
  ContentGrid,
  DyadCensusPrompts,
  ExternalDataSource,
  FilteredEdgeType,
  FilteredNodeType,
  Form,
  InterviewScript,
  IntroductionPanel,
  NameGeneratorAutoCompletePrompts,
  NameGeneratorListPrompts,
  NameGeneratorPrompts,
  NarrativeBehaviours,
  NarrativePresets,
  NodePanels,
  NodeType,
  EdgeType,
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
    EdgeType,
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
    NodeType,
    FilteredNodeType,
    IntroductionPanel,
    Form,
    SkipLogic,
    InterviewScript,
  ],
};

const CategoricalBin = {
  sections: [
    NodeType,
    FilteredNodeType,
    CategoricalBinPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const DyadCensus = {
  sections: [
    NodeType,
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

const NameGeneratorAutoComplete = {
  sections: [
    NodeType,
    ExternalDataSource,
    CardDisplayOptions,
    SearchOptionsForExternalData,
    NameGeneratorAutoCompletePrompts,
    SkipLogic,
    InterviewScript,
  ],
  name: 'Large Roster Name Generator',
};

const NameGeneratorList = {
  sections: [
    NodeType,
    ExternalDataSource,
    CardDisplayOptions,
    SortOptionsForExternalData,
    NameGeneratorListPrompts,
    SkipLogic,
    InterviewScript,
  ],
  name: 'Small Roster Name Generator',
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
    NodeType,
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
    NodeType,
    FilteredNodeType,
    OrdinalBinPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const Sociogram = {
  sections: [
    NodeType,
    FilteredNodeType,
    Background,
    SociogramPrompts,
    SkipLogic,
    InterviewScript,
  ],
};

const TieStrengthCensus = {
  sections: [
    NodeType,
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
  NameGeneratorAutoComplete,
  NameGeneratorList,
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
