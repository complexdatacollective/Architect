import React from 'react';
import { Section } from '@components/EditorLayout';
import SkipLogic from '../StageEditor/SkipLogic';

const SkipLogicSection = () => (
  <Section toggleable group title="Skip Logic">
    <SkipLogic />
  </Section>
);

SkipLogicSection.propTypes = {
};

SkipLogicSection.defaultProps = {
};

export { SkipLogicSection };

export default SkipLogicSection;
