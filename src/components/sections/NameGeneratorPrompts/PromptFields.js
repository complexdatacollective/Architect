import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field as RichTextField } from '@codaco/ui/lib/components/Fields/RichText';
import { getFieldId } from '@app/utils/issues';
import { Section, Row } from '@components/EditorLayout';
import ValidatedField from '@components/Form/ValidatedField';
import AssignAttributes from '@components/AssignAttributes';
import Tip from '@components/Tip';

class PromptFields extends PureComponent {
  render() {
    const {
      type,
      entity,
      form,
    } = this.props;

    return (
      <>
        <Section>
          <Row>
            <h3 id={getFieldId('text')}>Prompt Text</h3>
            <p>
              The prompt text instructs your participant about the task on this stage.
              Enter the text to use for your prompt below.
            </p>
            <Tip>
              <p>
                You can use markdown formatting in this prompt to create bold or underlined text.
              </p>
            </Tip>

            <ValidatedField
              name="text"
              component={RichTextField}
              inline
              className="stage-editor-section-prompt__textarea"
              label=""
              placeholder="Enter text for the prompt here..."
              validation={{ required: true, maxLength: 220 }}
            />
          </Row>
        </Section>
        <Section>
          <Row>
            <h3>
              Assign Additional Variables?
              <small>(optional)</small>
            </h3>
            <p>
              This feature allows you to assign a variable and associated value to
              any nodes created on this prompt. You can use this to
              keep track of where a node was elicited, or to reflect a name interpreter element of
              your prompt. For example, if you have a prompt that asks &apos;Who are you
              close to?&apos;, you could add an additional variable called close_tie
              and set it to true. You could then use this variable in your skip logic or
              stage filtering rules.
            </p>
            <AssignAttributes
              form={form}
              name="additionalAttributes"
              id="additionalAttributes"
              type={type}
              entity={entity}
            />
          </Row>
        </Section>
      </>
    );
  }
}

PromptFields.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string,
  form: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  type: null,
  entity: null,
};

export { PromptFields };

export default PromptFields;
