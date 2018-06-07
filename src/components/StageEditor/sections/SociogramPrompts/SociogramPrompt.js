import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, clearFields } from 'redux-form';
import { keys, get, toPairs } from 'lodash';
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

// Background options
const BACKGROUND_IMAGE = 'BACKGROUND/BACKGROUND_IMAGE';
const CONCENTRIC_CIRCLES = 'BACKGROUND/CONCENTRIC_CIRCLES';

// On node click options
const HIGHLIGHT = 'CLICK/HIGHLIGHT';
const CREATE_EDGE = 'CLICK/CREATE_EDGE';

class SociogramPrompt extends Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    nodeTypes: PropTypes.array.isRequired,
    edgeTypes: PropTypes.array.isRequired,
    layoutsForNodeType: PropTypes.array.isRequired,
    variablesForNodeType: PropTypes.array.isRequired,
    clearField: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundType: CONCENTRIC_CIRCLES,
    };
  }

  handleChooseBackgroundType = (event) => {
    this.setState({ backgroundType: event.target.value });
  }

  handleHighlightOrCreateEdge = (type) => {
    switch (type) {
      case HIGHLIGHT:
        return this.props.clearField('edges.create');
      case CREATE_EDGE:
        return this.props.clearField('highlight.allowHighlighting');
      default:
        return null;
    }
  }

  render() {
    const { backgroundType } = this.state;
    const {
      fieldId,
      nodeTypes,
      edgeTypes,
      layoutsForNodeType,
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
          {/*
          //  "nodeBinSortOrder": {
          //     "nickname": "DESC"
          //   },
          */}
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Layout</div>
          <Field
            name={`${fieldId}.highlight.layoutVariable`}
            component={Fields.Select}
          >
            <option disabled selected>Select one</option>
            {layoutsForNodeType.map(([variableName, meta]) => (
              <option value={variableName}>{meta.label}</option>
            ))}
          </Field>

          <Field
            name={`${fieldId}.layout.allowPositioning`}
            component={Fields.Checkbox}
            label="Allow positioning?"
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Display</div>
          <h4>Highlight</h4>
          <Field
            name={`${fieldId}.highlight.variable`}
            component={Fields.Select}
          >
            <option disabled selected>Select one</option>
            {variablesForNodeType.map(([variableName, meta]) => (
              <option value={variableName}>{meta.label}</option>
            ))}
          </Field>
          <Field
            name={`${fieldId}.highlight.value`}
            component="input"
            hidden
            value
          />
          <h4>Show edges:</h4>
          <Field
            name={`${fieldId}.edges.display`}
            component={Fields.CheckboxList}
            options={edgeTypes}
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Click interaction</div>
          <h4>Toggle highlight attribute</h4>
          <Field
            name={`${fieldId}.highlight.allowHighlighting`}
            component={Fields.Checkbox}
            label="Allow highlighting?"
            onChange={() => this.handleHighlightOrCreateEdge(HIGHLIGHT)}
          />
          <p>OR</p>
          <h4>Create node</h4>
          <Field
            name={`${fieldId}.edges.create`}
            component={Fields.RadioGroup}
            options={edgeTypes}
            onChange={() => this.handleHighlightOrCreateEdge(CREATE_EDGE)}
          />
        </div>
        <div className="stage-editor-section-name-generator-prompt__setting">
          <div className="stage-editor-section-name-generator-prompt__setting-label">Background</div>
          <div>
            <p>Background type:</p>
            <Fields.Radio
              label="Circles"
              input={{
                value: CONCENTRIC_CIRCLES,
                name: 'backgroundType',
                onChange: this.handleChooseBackgroundType,
              }}
              checked={backgroundType === CONCENTRIC_CIRCLES}
            />
            <Fields.Radio
              label="Image"
              input={{
                value: BACKGROUND_IMAGE,
                name: 'backgroundType',
                onChange: this.handleChooseBackgroundType,
              }}
              checked={backgroundType === BACKGROUND_IMAGE}
            />
          </div>
          { (backgroundType === CONCENTRIC_CIRCLES) &&
            <Fragment>
              <Field
                name={`${fieldId}.background.concentricCircles`}
                component={Fields.Text}
                label="How many circles?"
                normalize={value => parseInt(value, 10)}
                placeholder="5"
              />
              <Field
                name={`${fieldId}.background.skewedTowardCenter`}
                component={Fields.Checkbox}
                label="Skewed towards center?"
              />
            </Fragment>
          }
          { (backgroundType === BACKGROUND_IMAGE) &&
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
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, props.fieldId), 'subject.type');
  const variables = toPairs(getVariablesForNodeType(state, nodeType));

  return {
    layoutsForNodeType: variables.filter(([, meta]) => meta.type === 'layout'),
    variablesForNodeType: variables.filter(([, meta]) => meta.type === 'boolean'),
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    edgeTypes: keys(state.protocol.present.variableRegistry.edge),
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  clearField: (field) => {
    dispatch(clearFields(props.form.name, false, false, `${props.fieldId}.${field}`));
  },
});

export { SociogramPrompt };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  SociogramPrompt,
);
