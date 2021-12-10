import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { useSelector } from 'react-redux';
import { Section, Row } from '@components/EditorLayout';
import PromptText from '@components/sections/PromptText';
import AssignAttributes from '@components/AssignAttributes';
import Tip from '@components/Tip';

const PromptFields = ({
  form,
  entity,
  type,
}) => {
  const getFormValue = formValueSelector('editable-list-form');
  const hasAdditionalAttributes = useSelector((state) => getFormValue(state, 'additionalAttributes'));

  return (
    <>
      <PromptText />
      <Section
        title="Assign additional Variables"
        toggleable
        startExpanded={!!hasAdditionalAttributes}
      >
        <Row>
          <p>
            This feature allows you to assign a variable and associated value to
            any nodes created on this prompt. You can use this to
            keep track of where a node was elicited, or to reflect a name interpreter element of
            your prompt. For example, if you have a prompt that asks &apos;Who are you
            close to?&apos;, you could add an additional variable called close_tie
            and set it to true. You could then use this variable in your skip logic or
            stage filtering rules.
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
};

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
