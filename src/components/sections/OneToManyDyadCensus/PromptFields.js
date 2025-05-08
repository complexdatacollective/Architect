import React from 'react';
import PropTypes from 'prop-types';
import { Field as RichText } from '@codaco/ui/lib/components/Fields/RichText';
import { Section, Row } from '@components/EditorLayout';
import { getFieldId } from '@app/utils/issues';
import Tip from '@components/Tip';
import ValidatedField from '@components/Form/ValidatedField';
import { compose } from 'recompose';
import { formValueSelector } from 'redux-form';
import { useSelector } from 'react-redux';
import EntitySelectField from '../fields/EntitySelectField/EntitySelectField';
import BucketSortOrderSection from '../BucketSortOrderSection';
import BinSortOrderSection from '../BinSortOrderSection';
import { getSortOrderOptionGetter } from '../CategoricalBinPrompts/optionGetters';
import withVariableOptions from '../CategoricalBinPrompts/withVariableOptions';

const PromptFields = ({
  form,
  variableOptions,
}) => {
  const sortMaxItems = getSortOrderOptionGetter(variableOptions)('property').length;
  const getFormValue = formValueSelector(form);
  const edgeVariable = useSelector((state) => getFormValue(state, 'createEdge'));

  return (
    <>
      <Section
        title="One to Many Dyad Census Prompts"
      >
        <Row>
          <div id={getFieldId('text')} data-title="Dyad Census Prompts" />
          <p>
            One to Many Dyad Census prompts guide your participant in evaluating relationships
            between a single focal node and several target nodes.
            (for example, &apos;friendship&apos;, &apos;material
            support&apos; or &apos;conflict&apos;). Enter prompt text below, and select an
            edge type that will be created when the participant selects a target node.
          </p>
          <Tip type="info">
            <p>
              Remember to write your prompt text so that it clearly indicates the participant
              is evaluating the relationship between one specific individual and each of the others
              shown. Use phrases such
              as &apos;
              <strong>which of the following people</strong>
              &apos;,
              or &apos;
              <strong>select all people with whom this person</strong>
              &apos; to
              indicate that the participant should focus on selecting from the group.
            </p>
          </Tip>
          <ValidatedField
            name="text"
            component={RichText}
            inline
            className="stage-editor-section-prompt__textarea"
            label="Prompt Text"
            placeholder="Enter text for the prompt here..."
            validation={{ required: true, maxLength: 220 }}
          />
        </Row>
        <Row>
          <ValidatedField
            entityType="edge"
            name="createEdge"
            component={EntitySelectField}
            label="Create edges of the following type"
            validation={{ required: true }}
          />
        </Row>
      </Section>

      <BucketSortOrderSection
        form={form}
        disabled={!edgeVariable}
        maxItems={sortMaxItems}
        optionGetter={getSortOrderOptionGetter(variableOptions)}
        summary={(
          <p>
            The focal nodes are presented one at a time. You may optionally configure a
            list of rules to determine how nodes are sorted in the bucket
            when the task starts, which will determine the order that your participant evaluates
            their relationships. Interviewer will default to using the order in which nodes were
            named.
          </p>
        )}
      />
      <BinSortOrderSection
        form={form}
        disabled={!edgeVariable}
        maxItems={sortMaxItems}
        optionGetter={getSortOrderOptionGetter(variableOptions)}
        summary={(
          <p>
            You may also configure one or more sort rules that determine the order that the
            target nodes are sorted in the bin.
          </p>
        )}
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
  variableOptions: PropTypes.arrayOf(selectOptionProps),
  form: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  variableOptions: [],
};

export default compose(
  withVariableOptions,
)(PromptFields);
