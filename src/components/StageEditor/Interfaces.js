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
  OrdinalBinPrompts,
  QuickAdd,
  SearchOptionsForExternalData,
  SociogramPrompts,
  SortOptionsForExternalData,
  TieStrengthCensusPrompts,
  Title,
} from '@components/sections';

const AlterEdgeForm = {
  headerSections: [
    FilteredEdgeType,
  ],
  sections: [
    IntroductionPanel,
    Form,
    InterviewScript,
  ],
  template: {},
};

const AlterForm = {
  headerSections: [
    FilteredNodeType,
  ],
  sections: [
    IntroductionPanel,
    Form,
    InterviewScript,
  ],
};

const CategoricalBin = {
  headerSections: [
    FilteredNodeType,
  ],
  sections: [
    CategoricalBinPrompts,
    InterviewScript,
  ],
};

const DyadCensus = {
  headerSections: [
    FilteredNodeType,
  ],
  sections: [
    IntroductionPanel,
    DyadCensusPrompts,
    InterviewScript,
  ],
};

const EgoForm = {
  headerSections: [
  ],
  sections: [
    IntroductionPanel,
    Form,
    InterviewScript,
  ],
  template: {},
};

const Information = {
  headerSections: [
  ],
  sections: [
    Title,
    ContentGrid,
    InterviewScript,
  ],
};

const NameGenerator = {
  headerSections: [
    NodeType,
  ],
  sections: [
    Form,
    NameGeneratorPrompts,
    NodePanels,
    InterviewScript,
  ],
  name: 'Name Generator (using forms)',
};

const NameGeneratorAutoComplete = {
  headerSections: [
    NodeType,
  ],
  sections: [
    ExternalDataSource,
    CardDisplayOptions,
    SearchOptionsForExternalData,
    NameGeneratorAutoCompletePrompts,
    InterviewScript,
  ],
  name: 'Large Roster Name Generator',
};

const NameGeneratorList = {
  headerSections: [
    NodeType,
  ],
  sections: [
    ExternalDataSource,
    CardDisplayOptions,
    SortOptionsForExternalData,
    NameGeneratorListPrompts,
    InterviewScript,
  ],
  name: 'Small Roster Name Generator',
};

const NameGeneratorQuickAdd = {
  headerSections: [
    NodeType,
  ],
  sections: [
    QuickAdd,
    NameGeneratorPrompts,
    NodePanels,
    InterviewScript,
  ],
  name: 'Name Generator (quick add mode)',
};

const Narrative = {
  headerSections: [
    FilteredNodeType,
  ],
  sections: [
    Background,
    NarrativePresets,
    NarrativeBehaviours,
    InterviewScript,
  ],
  template: {
    behaviours: {
      allowRepositioning: true,
    },
  },
};

const OrdinalBin = {
  headerSections: [
    FilteredNodeType,
  ],
  sections: [
    OrdinalBinPrompts,
    InterviewScript,
  ],
};

const Sociogram = {
  headerSections: [
    FilteredNodeType,
  ],
  sections: [
    Background,
    SociogramPrompts,
    InterviewScript,
  ],
};

const TieStrengthCensus = {
  headerSections: [
    FilteredNodeType,
  ],
  sections: [
    IntroductionPanel,
    TieStrengthCensusPrompts,
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
