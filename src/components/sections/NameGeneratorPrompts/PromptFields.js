import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getFieldId } from '../../../utils/issues';
import TextArea from '../../../ui/components/Fields/TextArea';
import ValidatedField from '../../Form/ValidatedField';
import AssignAttributes from '../../AssignAttributes';
import { Row } from '../../OrderedList';

class PromptFields extends PureComponent {
  render() {
    const {
      nodeType,
      form,
    } = this.props;

    return (
      <React.Fragment>
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
            nodeType={nodeType}
          />
        </Row>
      </React.Fragment>
    );
  }
}

PromptFields.propTypes = {
  nodeType: PropTypes.string,
  form: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  nodeType: null,
};

export { PromptFields };

export default PromptFields;
