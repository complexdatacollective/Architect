import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getFieldId } from '../../../utils/issues';
import TextArea from '../../../ui/components/Fields/TextArea';
import ValidatedField from '../../Form/ValidatedField';
import AssignAttributes from '../../AssignAttributes';
import Row from '../Row';
import Section from '../Section';

class PromptFields extends PureComponent {
  render() {
    const {
      type,
      entity,
      form,
    } = this.props;

    return (
      <Section>
        <Row>
          <h3 id={getFieldId('text')}>Text for Prompt</h3>
          <ValidatedField
            name="text"
            component={TextArea}
            className="stage-editor-section-prompt__textarea"
            label=""
            placeholder="Enter text for the prompt here"
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3>Assign attributes</h3>
          <AssignAttributes
            form={form}
            name="additionalAttributes"
            id="additionalAttributes"
            type={type}
            entity={entity}
          />
        </Row>
      </Section>
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
