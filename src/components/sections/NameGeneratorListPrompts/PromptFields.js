import React from 'react';
import PropTypes from 'prop-types';
import { Section, Row } from '@components/EditorLayout';
import PromptText from '@components/sections/PromptText';
import AssignAttributes from '@components/AssignAttributes';
import Tip from '@components/Tip';

const PromptFields = ({
  type,
  entity,
  form,
}) => (
  <>
    <PromptText />
    <Section>
      <Row>
        <h3>
          Assign Additional Variables?
          <small>(optional)</small>
        </h3>
        <p>
          You can assign additional variables to any nodes that are created by a
          participant on this prompt. You can use this feature to keep track of meta-data,
          such as where a node was elicited, or to reflect a name interpreter element of
          your prompt (for example by adding a variable called &quot;close_tie&quot; to a
          prompt that asks about closeness).
        </p>
        <Tip>
          <p>
            Select an existing variable, or select &quot;create new variable&quot;
            from the bottom of the list, and then assign a value. You can set different values
            for this variable for nodes created on different prompts.
          </p>
        </Tip>

        <AssignAttributes
          name="additionalAttributes"
          id="additionalAttributes"
          form={form}
          type={type}
          entity={entity}
        />
      </Row>
    </Section>
  </>
);

PromptFields.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string,
  form: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  type: null,
  entity: null,
};

export default PromptFields;
