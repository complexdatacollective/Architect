import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextArea from '../../../../ui/components/Fields/TextArea';
import { ValidatedField } from '../../../Form';
import AttributesTable from '../../../AttributesTable';
import { Row } from '../../../OrderedList';

class PromptFields extends PureComponent {
  render() {
    const {
      nodeType,
    } = this.props;

    return (
      <React.Fragment>
        <Row>
          <h3>Text for Prompt</h3>
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
          <h3>Additional attributes</h3>
          <AttributesTable
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
};

PromptFields.defaultProps = {
  nodeType: null,
};

export { PromptFields };

export default PromptFields;
