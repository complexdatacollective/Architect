import React from 'react';
import PropTypes from 'prop-types';
import { change, formValueSelector } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { Section, Row } from '@components/EditorLayout';
import PromptText from '@components/sections/PromptText';
import AssignAttributes from '@components/AssignAttributes';
import Tip from '@components/Tip';

const PromptFields = ({
  form,
  entity,
  type,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector('editable-list-form');
  const hasAdditionalAttributes = useSelector((state) => getFormValue(state, 'additionalAttributes'));

  const handleToggleAdditionalAttributes = (nextState) => {
    if (nextState === false) {
      dispatch(change(form, 'additionalAttributes', null));
    }

    return true;
  };

  return (
    <>
      <PromptText />
      <Section
        title="Assign additional Variables"
        toggleable
        startExpanded={!!hasAdditionalAttributes}
        summary={(
          <p>
            This feature allows you to assign a variable and associated value to
            any nodes created on this prompt. You could then use this variable in your skip logic or
            stage filtering rules.
          </p>
        )}
        handleToggleChange={handleToggleAdditionalAttributes}
      >
        <Row>
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
