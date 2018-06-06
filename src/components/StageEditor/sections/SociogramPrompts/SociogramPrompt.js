import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { keys, get } from 'lodash';
import * as Fields from '../../../Form/Fields';

// reference
// {
//   "id": "closeness1",
//   "text": "Position the nodes amongst the concentric circles. Place people you are closer to towards the middle",
//   "subject": {
//     "entity": "node",
//     "type": "person"
//   },
//   "filter": "return operator.or([\nselect.edge({ type: 'friend' }),\nselect.alter({ type: 'person', attribute: 'age', operator: 'GREATER_THAN', value: 29 })]);",
//   "layout": {
//     "layoutVariable": "closenessLayout",
//     "allowPositioning": true
//   },
//   "edges": {
//     "display": ["friends", "professional"],
//     "create": "friends"
//   },
//   "highlight": {
//     "variable": "has_given_advice",
//     "value": true,
//     "allowHighlighting": true
//   },
//   "disable": "return operator.or([\nselect.edge({ type: 'friend' }),\nselect.alter({ type: 'person', attribute: 'age', operator: 'LESS_THAN', value: 29 })]);",
//   "nodeBinSortOrder": {
//     "nickname": "DESC"
//   },
//   "background": {
//     "concentricCircles": 4,
//     "skewedTowardCenter": true
//   }
// }

class SociogramPrompt extends Component {

  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    nodeTypes: PropTypes.array.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundType: 'circles',
    };
  }

  render() {
    const {
      fieldId,
      nodeTypes,
    } = this.props;

    return (
      <div className="stage-editor-section-name-generator-prompt">
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Text for prompt</div>
          <Field
            name={`${fieldId}.text`}
            component={Fields.Markdown}
            className="stage-editor-section-name-generator-prompt__setting-value"
            placeholder="Enter text for the prompt here"
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Which nodes?</div>
          <Field
            name={`${fieldId}.subject`}
            parse={value => ({ type: value, entity: 'node' })}
            format={value => get(value, 'type')}
            options={nodeTypes}
            component={Fields.Contexts}
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Layout</div>
          <Field
            name={`${fieldId}.layout.layoutVariable`}
            component={Fields.Text}
            label="Layout variable"
            className="stage-editor-section-name-generator-prompt__setting-value"
            placeholder="MY_VARIABLE"
          />
          <Field
            name={`${fieldId}.layout.allowPositioning`}
            component={Fields.Checkbox}
            label="Allow positioning?"
            className="stage-editor-section-name-generator-prompt__setting-value"
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Background</div>
          <div>
            <p>Background type:</p>
            <Fields.Radio label="Circles" input={{ value: 'circles', name: 'backgroundType' }} />
            <Fields.Radio label="Circles" input={{ value: 'image', name: 'backgroundType' }} />
          </div>
          <Field
            name={`${fieldId}.background.concentricCircles`}
            component={Fields.Text}
            label="How many circles?"
            className="stage-editor-section-name-generator-prompt__setting-value"
            placeholder="5"
          />
          <Field
            name={`${fieldId}.background.skewedTowardCenter`}
            component={Fields.Checkbox}
            label="Skewed towards center?"
            className="stage-editor-section-name-generator-prompt__setting-value"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  nodeTypes: keys(state.protocol.present.variableRegistry.node),
  edgeTypes: keys(state.protocol.present.variableRegistry.edge),
});

export { SociogramPrompt };

export default connect(
  mapStateToProps,
)(
  SociogramPrompt,
);
