import {
  Name,
  FilteredNodeType,
  IntroductionPanel,
  DyadCensusPrompts,
} from '@components/sections';

const DyadCensus = {
  headerSections: [
    Name,
    FilteredNodeType,
  ],
  sections: [
    IntroductionPanel,
    DyadCensusPrompts,
  ],
};

export default DyadCensus;
