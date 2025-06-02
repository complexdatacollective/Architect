import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import RichTextField from '@codaco/ui/lib/components/Fields/RichText';
import { ValidatedField } from '@components/Form';
import Options from '@components/Options';
import { Section, Row } from '@components/EditorLayout';
import Tip from '@components/Tip';
import PromptText from '@components/sections/PromptText';
import NewVariableWindow, { useNewVariableWindowState } from '@components/NewVariableWindow';
import { getSortOrderOptionGetter } from './optionGetters';
import withVariableOptions from './withVariableOptions';
import withVariableHandlers from './withVariableHandlers';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';
import BucketSortOrderSection from '../BucketSortOrderSection';
import BinSortOrderSection from '../BinSortOrderSection';
import IssueAnchor from '../../IssueAnchor';

const PromptFields = ({
  changeForm,
  entity,
  form,
  onCreateOtherVariable,
  optionsForVariableDraft,
  otherVariable,
  type,
  variable,
  variableOptions,
}) => {
  const newVariableWindowInitialProps = {
    entity,
    type,
    initialValues: { name: null, type: null },
  };

  const handleCreatedNewVariable = (id, { field }) => changeForm(form, field, id);

  const handleToggleOtherVariable = (nextState) => {
    if (nextState === false) {
      changeForm(form, 'otherVariable', null);
      changeForm(form, 'otherVariablePrompt', null);
      changeForm(form, 'otherOptionLabel', null);
    }

    return true;
  };

  const [newVariableWindowProps, openNewVariableWindow] = useNewVariableWindowState(
    newVariableWindowInitialProps,
    handleCreatedNewVariable,
  );

  const handleNewVariable = (name) => openNewVariableWindow({ initialValues: { name, type: 'categorical' } }, { field: 'variable' });

  const categoricalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'categorical');

  const otherVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'text');

  const sortMaxItems = getSortOrderOptionGetter(variableOptions)('property').length;

  const totalOptionsLength = (
    optionsForVariableDraft && optionsForVariableDraft.length
    + (!!otherVariable && 1)
  );

  const showVariableOptionsTip = totalOptionsLength > 8;

  return (
    <>
      <PromptText />
      <Section title="Categorical Variable">
        <Row>
          <ValidatedField
            name="variable"
            description="Categorical variable"
            component={VariablePicker}
            type={type}
            entity={entity}
            options={categoricalVariableOptions}
            onCreateOption={handleNewVariable}
            validation={{ required: true }}
            variable={variable}
          />
        </Row>
        { variable && (
        <Row>
          <h3>Variable Options</h3>
          <p>
            Create
            {' '}
            <strong>up to 8</strong>
            {' '}
            options for this variable.
          </p>
          { showVariableOptionsTip && (
            <Tip type="error">
              <p>
                The categorical bin interface is designed to use
                {' '}
                <strong>
                  up to 8 option values
                </strong>
                {' '}
                (
                including an &quot;other&quot; variable). Using more will create
                a sub-optimal experience for participants, and might reduce data quality.
                Consider grouping your variable options and capturing further detail with
                follow-up questions.
              </p>
            </Tip>
          )}
          <IssueAnchor fieldName="options" description="Variable options">
            <Options
              name="variableOptions"
              label="Options"
            />
          </IssueAnchor>
        </Row>
        )}
      </Section>
      <Section
        disabled={!variable}
        title="Follow-up &quot;Other&quot; Option"
        summary={(
          <p>
            You can optionally create an &quot;other&quot; option that triggers a
            follow-up dialog
            when nodes are dropped within it, and stores the value the participant enters in a
            designated variable. This feature may be useful in order to collect values
            you might not have listed above.
          </p>
        )}
        toggleable
        startExpanded={!!otherVariable}
        handleToggleChange={handleToggleOtherVariable}
      >
        <Row>
          <ValidatedField
            name="otherVariable"
            issueDescription="Other variable"
            component={VariablePicker}
            entity={entity}
            type={type}
            options={otherVariableOptions}
            onCreateOption={(value) => onCreateOtherVariable(value, 'otherVariable')}
            validation={{ required: true }}
            variable={otherVariable}
          />
        </Row>
        <Row>
          <ValidatedField
            name="otherOptionLabel"
            issueDescription="Label for Bin"
            component={RichTextField}
            inline
            placeholder="Enter a label (such as &quot;other&quot;) for this bin..."
            label="Label for Bin"
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <ValidatedField
            name="otherVariablePrompt"
            issueDescription="Prompt for Dialog"
            component={RichTextField}
            inline
            placeholder="Enter a question prompt to show when the other option is triggered..."
            label="Question Prompt for Dialog"
            validation={{ required: true }}
          />
        </Row>
      </Section>
      <BucketSortOrderSection
        form={form}
        disabled={!variable}
        maxItems={sortMaxItems}
        optionGetter={getSortOrderOptionGetter(variableOptions)}
      />
      <BinSortOrderSection
        form={form}
        disabled={!variable}
        maxItems={sortMaxItems}
        optionGetter={getSortOrderOptionGetter(variableOptions)}
      />
      <NewVariableWindow
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...newVariableWindowProps}
      />
    </>
  );
};

const selectOptionProps = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]),
});

PromptFields.propTypes = {
  entity: PropTypes.string.isRequired,
  otherVariable: PropTypes.string,
  type: PropTypes.string.isRequired,
  variable: PropTypes.string,
  variableOptions: PropTypes.arrayOf(selectOptionProps),
  changeForm: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  onCreateOtherVariable: PropTypes.func.isRequired,
  optionsForVariableDraft: PropTypes.arrayOf(selectOptionProps),
};

PromptFields.defaultProps = {
  variable: null,
  otherVariable: null,
  variableOptions: [],
  optionsForVariableDraft: [],
};

export default compose(
  withVariableOptions,
  withVariableHandlers,
)(PromptFields);
