import React from 'react';
import { Section } from '@components/EditorLayout';
import SkipLogic from '../StageEditor/SkipLogic';

const SkipLogicSection = () => (
  <Section
    toggleable
    group
    title="Skip Logic"
    summary={(
      <p>
        Use skip logic to determine if this stage should be shown in the interview.
      </p>
    )}
  >
    <SkipLogic />
  </Section>
);

SkipLogicSection.propTypes = {
};

SkipLogicSection.defaultProps = {
};

export { SkipLogicSection };

export default SkipLogicSection;
