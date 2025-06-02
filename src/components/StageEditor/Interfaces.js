/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import {
  Background,
  CardDisplayOptions,
  CategoricalBinPrompts,
  ContentGrid,
  DyadCensusPrompts,
  OneToManyDyadCensusPrompts,
  OneToManyDyadCensusBehaviours,
  ExternalDataSource,
  AutomaticLayout,
  FilteredEdgeType,
  Form,
  InterviewScript,
  IntroductionPanel,
  NameGeneratorRosterPrompts,
  NameGeneratorPrompts,
  NarrativeBehaviours,
  NarrativePresets,
  NodePanels,
  NodeType,
  MinMaxAlterLimits,
  OrdinalBinPrompts,
  QuickAdd,
  SearchOptionsForExternalData,
  SociogramPrompts,
  SortOptionsForExternalData,
  SkipLogic,
  TieStrengthCensusPrompts,
  Title,
  MapOptions,
  GeospatialPrompts,
  AnonymisationExplanation,
  AnonymisationValidation,
  EncryptedVariables,
} from '@components/sections';
import { FilteredNodeType } from '@components/sections/NodeType';

const AlterEdgeForm = {
  sections: [
    FilteredEdgeType,
    IntroductionPanel,
    Form,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/per-alter-edge-form/',
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
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/per-alter-form/',
};

const CategoricalBin = {
  sections: [
    FilteredNodeType,
    CategoricalBinPrompts,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/categorical-bin/',
};

const DyadCensus = {
  sections: [
    FilteredNodeType,
    IntroductionPanel,
    DyadCensusPrompts,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/dyad-census/',
};

const OneToManyDyadCensus = {
  sections: [
    FilteredNodeType,
    OneToManyDyadCensusBehaviours,
    OneToManyDyadCensusPrompts,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/one-to-many-dyad-census/',
  template: {
    behaviours: {
      removeAfterConsideration: true,
    },
  },
};

const EgoForm = {
  sections: [
    IntroductionPanel,
    Form,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/ego-form/',
  template: {},
};

const Information = {
  sections: [
    Title,
    ContentGrid,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/information/',
};

const NameGenerator = {
  sections: [
    NodeType,
    Form,
    NameGeneratorPrompts,
    NodePanels,
    SkipLogic,
    MinMaxAlterLimits,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/name-generator-using-forms/',
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
    MinMaxAlterLimits,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/name-generator-roster/',
  name: 'Name Generator for Roster Data',
};

const NameGeneratorQuickAdd = {
  sections: [
    NodeType,
    QuickAdd,
    NameGeneratorPrompts,
    NodePanels,
    SkipLogic,
    MinMaxAlterLimits,
    InterviewScript,
  ],
  name: 'Name Generator (quick add)',
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/name-generator-using-quick-add/',
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
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/narrative/',
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
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/ordinal-bin/',
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
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/sociogram/',
};

const TieStrengthCensus = {
  sections: [
    FilteredNodeType,
    IntroductionPanel,
    TieStrengthCensusPrompts,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/tie-strength-census/',
};

const Geospatial = {
  sections: [
    FilteredNodeType,
    IntroductionPanel,
    MapOptions,
    GeospatialPrompts,
    SkipLogic,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/geospatial/',
};

const Anonymisation = {
  sections: [
    AnonymisationExplanation,
    AnonymisationValidation,
    EncryptedVariables,
    InterviewScript,
  ],
  documentation: 'https://documentation.networkcanvas.com/interface-documentation/anonymisation/',
};

const interfaces = {
  AlterEdgeForm,
  AlterForm,
  CategoricalBin,
  DyadCensus,
  OneToManyDyadCensus,
  EgoForm,
  Information,
  NameGenerator,
  NameGeneratorRoster,
  NameGeneratorQuickAdd,
  Narrative,
  OrdinalBin,
  Sociogram,
  TieStrengthCensus,
  Geospatial,
  Anonymisation,
};

const emptyInterface = {
  sections: [],
  template: {},
};

export const getInterface = (interfaceType) => get(interfaces, interfaceType, emptyInterface);
