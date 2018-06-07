import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { keys, get } from 'lodash';
import * as Fields from '../../../Form/Fields';

// reference
// {
//   "id": "closeness1",
//   "text": "Position the nodes amongst the concentric circles. Place people you are closer to
// towards the middle",
//   "subject": {
//     "entity": "node",
//     "type": "person"
//   },
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
    variablesForNodeType: PropTypes.array.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundType: 'circles',
    };
  }

  handleChooseBackgroundType = (event) => {
    this.setState({ backgroundType: event.target.value });
  }

  render() {
    const { backgroundType } = this.state;
    const {
      fieldId,
      nodeTypes,
      variablesForNodeType,
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
            placeholder="MY_VARIABLE"
          />
          <Field
            name={`${fieldId}.layout.allowPositioning`}
            component={Fields.Checkbox}
            label="Allow positioning?"
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Highlight</div>
          <Fields.Select
            className="stage-editor-section-name-generator-prompt__setting-value"
            name={`${fieldId}.highlight.variable`}
            options={variablesForNodeType}
          />
          <Field
            name={`${fieldId}.highlight.value`}
            component={Fields.Text}
            placeholder="TRUE"
          />
          <Field
            name={`${fieldId}.layout.allowHighlighting`}
            component={Fields.Checkbox}
            label="Allow highlighting?"
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Background</div>
          <div>
            <p>Background type:</p>
            <Fields.Radio
              label="Circles"
              input={{
                value: 'circles',
                name: 'backgroundType',
                checked: (backgroundType === 'circles'),
                onChange: this.handleChooseBackgroundType,
              }}
            />
            <Fields.Radio
              label="Image"
              input={{
                value: 'image',
                name: 'backgroundType',
                checked: (backgroundType === 'image'),
                onChange: this.handleChooseBackgroundType,
              }}
            />
          </div>
          { (backgroundType === 'circles') &&
            <Fragment>
              <Field
                name={`${fieldId}.background.concentricCircles`}
                component={Fields.Text}
                label="How many circles?"
                placeholder="5"
              />
              <Field
                name={`${fieldId}.background.skewedTowardCenter`}
                component={Fields.Checkbox}
                label="Skewed towards center?"
              />
            </Fragment>
          }
          { (backgroundType === 'image') &&
            <Field
              name={`${fieldId}.background.image`}
              component={Fields.Image}
              label="Skewed towards center?"
            />
          }
        </div>
      </div>
    );
  }
}

const getVariablesForNodeType = (state, nodeType) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  return keys(get(variableRegistry, ['node', nodeType, 'variables'], {}));
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, props.fieldId), 'subject.type');
  return {
    variablesForNodeType: getVariablesForNodeType(state, nodeType),
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    edgeTypes: keys(state.protocol.present.variableRegistry.edge),
  };
};

export { SociogramPrompt };

export default connect(
  mapStateToProps,
)(
  SociogramPrompt,
);
