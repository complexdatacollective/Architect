import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Section, Row } from '@components/EditorLayout';
import AssignAttributes from '@components/AssignAttributes';
import PromptText from '@components/sections/PromptText';

class PromptFields extends PureComponent {
  render() {
    const {
      type,
      entity,
      form,
    } = this.props;

    return (
      <>
        <PromptText />
        <Section>
          <Row>
            <h3>
              Assign Additional Variables?
              { ' ' }
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

export default PromptFields;
