import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field, clearFields, isInvalid, FormSection, hasSubmitFailed } from 'redux-form';
import { get, toPairs, isEmpty, map, find } from 'lodash';
import { getNodeTypes } from '../../../../selectors/variableRegistry';
import Guidance from '../../../Guidance';
import Node from '../../../../ui/components/Node';
import { ValidatedField } from '../../../Form';
import * as ArchitectFields from '../../../Form/Fields';
import * as Fields from '../../../../ui/components/Fields';
import { ExpandableItem } from '../../../Items';
import { getFieldId } from '../../../../utils/issues';

// Background options
const BACKGROUND_IMAGE = 'BACKGROUND/BACKGROUND_IMAGE';
const CONCENTRIC_CIRCLES = 'BACKGROUND/CONCENTRIC_CIRCLES';

// On node click options
const HIGHLIGHT = 'CLICK/HIGHLIGHT';
const CREATE_EDGE = 'CLICK/CREATE_EDGE';

const disableBlur = event => event.preventDefault();

const hasSubject = value =>
  (get(value, 'type') && get(value, 'entity') ? undefined : 'Required');

class SociogramPrompt extends Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    nodeTypes: PropTypes.array.isRequired,
    edgeTypes: PropTypes.array.isRequired,
    layoutsForNodeType: PropTypes.array.isRequired,
    variablesForNodeType: PropTypes.object.isRequired,
    highlightableForNodeType: PropTypes.array.isRequired,
    clearField: PropTypes.func.isRequired,
    isInvalid: PropTypes.bool,
    hasSubmitFailed: PropTypes.bool,
  };

  static defaultProps = {
    isInvalid: false,
    hasSubmitFailed: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundType: CONCENTRIC_CIRCLES,
    };
  }

  get isLockedOpen() {
    return this.props.isInvalid && this.props.hasSubmitFailed;
  }

  handleChooseBackgroundType = (option) => {
    this.setState({ backgroundType: option });
  }

  handleHighlightOrCreateEdge = (type) => {
    switch (type) {
      case HIGHLIGHT:
        return this.props.clearField(`${this.props.fieldId}.edges.create`);
      case CREATE_EDGE:
        return this.props.clearField(`${this.props.fieldId}.highlight.allowHighlighting`);
      default:
        return null;
    }
  }

  clearEmptyField = (event, value, previousValue, name) => {
    if (isEmpty(value)) {
      this.props.clearField(name);
      event.preventDefault();
    }
  }

  render() {
    const { backgroundType } = this.state;
    const {
      fieldId,
      nodeTypes,
      edgeTypes,
      variablesForNodeType,
      layoutsForNodeType,
      highlightableForNodeType,
      ...rest
    } = this.props;

    return (
      <ExpandableItem
        className="stage-editor-section-sociogram-prompt"
        lockOpen={this.isLockedOpen}
        preview={(
          <FormSection name={fieldId}>
            <div className="stage-editor-section-sociogram-prompt__preview">
              <div className="stage-editor-section-sociogram-prompt__preview-icon">
                <Field
                  name="subject.type"
                  component={
                    (field) => {
                      const nodeProperties = field.input.value ?
                        find(nodeTypes, ['value', field.input.value]) :
                        { label: '', color: 'node-color-seq-1' };
                      const nodeColor = get(nodeProperties, 'color', 'node-color-seq-1');
                      const nodeLabel = get(nodeProperties, 'label', '');
                      return <Node label={nodeLabel} color={nodeColor} />;
                    }
                  }
                />
              </div>
              <Field
                name="text"
                component={field => (
                  <Markdown
                    className="stage-editor-section-sociogram-prompt__preview-text"
                    source={field.input.value}
                  />
                )}
              />
            </div>
          </FormSection>
        )}
        {...rest}
      >
        <FormSection name={fieldId}>
          <Guidance contentId="guidance.editor.sociogram_prompt.text">
            <div className="stage-editor-section-prompt__group">
              <h3 className="stage-editor-section-prompt__group-title">Prompt text</h3>
              <p>
                Enter the text to use for your prompt below. Remember that you can add emphasis to
                your prompt using markdown syntax.
              </p>
              <div id={getFieldId(`${fieldId}.text`)} data-name="Prompt text" />
              <ValidatedField
                name="text"
                component={Fields.TextArea}
                className="stage-editor-section-prompt__setting"
                label=""
                placeholder="Enter text for the prompt here"
                validation={{ required: true }}
              />
            </div>
          </Guidance>
          <div className="stage-editor-section-prompt__group">
            <Guidance contentId="guidance.editor.sociogram_prompt.nodes">
              <div>
                <div id={getFieldId(`${fieldId}.subject`)} data-name="Prompt node type" />
                <h3 className="stage-editor-section-prompt__group-title">Nodes</h3>
                <ValidatedField
                  name="subject"
                  component={ArchitectFields.NodeSelect}
                  className="stage-editor-section-prompt__setting"
                  parse={value => ({ type: value, entity: 'node' })}
                  format={value => get(value, 'type')}
                  options={nodeTypes}
                  label="Select the type of node to be displayed on this prompt."
                  validation={{ hasSubject }}
                />
              </div>
            </Guidance>
            <Guidance contentId="guidance.editor.sociogram_prompt.sortOrder">
              <div>
                <p>
                  If you wish to customise the order that nodes are displayed in the bin before they
                  are positioned, create one or more sorting rules below.
                </p>
                <Field
                  name="sortOrder"
                  component={ArchitectFields.OrderBy}
                  className="stage-editor-section-prompt__setting"
                  variables={variablesForNodeType}
                  label="Node bin sorting rules:"
                />
              </div>
            </Guidance>
          </div>
          <Guidance contentId="guidance.editor.sociogram_prompt.background">
            <div className="stage-editor-section-prompt__group">
              <h3 className="stage-editor-section-prompt__group-title">Background</h3>
              <p>
                This section determines the graphical background for this prompt. You can choose
                between a conventional series of concentric circles, or provide your own background
                image.
              </p>
              <ArchitectFields.Mode
                label="Choose a background type"
                className="stage-editor-section-prompt__setting"
                options={[
                  { value: CONCENTRIC_CIRCLES, label: 'Circles' },
                  { value: BACKGROUND_IMAGE, label: 'Image' },
                ]}
                input={{
                  value: backgroundType,
                  onChange: this.handleChooseBackgroundType,
                }}
              />
              { (backgroundType === CONCENTRIC_CIRCLES) &&
                <Fragment>
                  <Field
                    name="background.concentricCircles"
                    component={Fields.Text}
                    className="stage-editor-section-prompt__setting"
                    label="Number of concentric circles to use:"
                    type="number"
                    placeholder="3"
                    normalize={value => parseInt(value, 10)}
                  />
                  <Field
                    name="background.skewedTowardCenter"
                    component={Fields.Checkbox}
                    className="stage-editor-section-prompt__setting"
                    label="Skew the size of the circles so that the middle is proportionally larger."
                  />
                </Fragment>
              }
              { (backgroundType === BACKGROUND_IMAGE) &&
                <div style={{ position: 'relative', minHeight: '100px' }}>
                  <Field
                    name="background.image"
                    component={ArchitectFields.Image}
                    className="stage-editor-section-prompt__setting"
                    label="Background image"
                  />
                </div>
              }
            </div>
          </Guidance>
          <Guidance contentId="guidance.editor.sociogram_prompt.layout">
            <div className="stage-editor-section-prompt__group">
              <div id={getFieldId(`${fieldId}.layout.layoutVariable`)} data-name="Prompt layout variable" />
              <h3 className="stage-editor-section-prompt__group-title">Layout</h3>
              <p>
                This section controls the position of nodes on this sociogram prompt. Decide if you
                want the participant to be able to drag nodes to position them, and select a layout
                variable to use for storing or retrieving position data.
              </p>
              <Field
                name="layout.allowPositioning"
                component={Fields.Checkbox}
                className="stage-editor-section-prompt__setting"
                label="Allow dragging nodes to position them?"
              />
              <ValidatedField
                name="layout.layoutVariable"
                component={ArchitectFields.Select}
                className="stage-editor-section-prompt__setting"
                label="Layout variable"
                placeholder="&mdash; Select a layout variable &mdash;"
                validation={{ required: true }}
                options={layoutsForNodeType.map(([variableId, meta]) => (
                  { value: variableId, label: meta.label }
                ))}
              />
            </div>
          </Guidance>

          <Guidance contentId="guidance.editor.sociogram_prompt.attributes">
            <div className="stage-editor-section-prompt__group">
              <h3 className="stage-editor-section-prompt__group-title">Attributes</h3>
              <p>
                Use this section to configure node highlighting. Choose a boolean variable below,
                and nodes with this attribute will automatically be highlighted. You can also allow
                the participant to toggle this attribute by simply tapping (or clicking) a node.
              </p>
              <Field
                name="highlight.variable"
                component={ArchitectFields.Select}
                className="stage-editor-section-prompt__setting"
                label="Highlight nodes with the following attribute:"
                onChange={this.clearEmptyField}
                onBlur={disableBlur}
                placeholder="&mdash; Select a variable to highlight &mdash;"
                options={highlightableForNodeType.map(([variableName, meta]) => (
                  { value: variableName, label: meta.label }
                ))}
              />
              <Field
                name="highlight.allowHighlighting"
                component={Fields.Checkbox}
                className="stage-editor-section-prompt__setting"
                label="Toggle this attribute by tapping on a node"
                onChange={() => this.handleHighlightOrCreateEdge(HIGHLIGHT)}
              />
            </div>
          </Guidance>
          <Guidance contentId="guidance.editor.sociogram_prompt.edges">
            <div className="stage-editor-section-prompt__group">
              <h3 className="stage-editor-section-prompt__group-title">Edges</h3>
              <p>
                This section controls edge creation and display. You can choose to display one or
                more edge types, and also allow the participant to create an edge of a given type.
              </p>
              <Field
                name="edges.display"
                component={Fields.CheckboxGroup}
                className="stage-editor-section-prompt__setting"
                options={edgeTypes}
                label="Display edges of the following type(s):"
              />
              <Field
                name="edges.create"
                component={ArchitectFields.Select}
                className="stage-editor-section-prompt__setting"
                options={edgeTypes}
                onChange={(...args) => {
                  this.clearEmptyField(...args);
                  this.handleHighlightOrCreateEdge(CREATE_EDGE);
                }}
                onBlur={disableBlur}
                placeholder="&mdash; Select an edge type &mdash;"
                label="Create edges of the following type (this will disable attribute toggling):"
              />
            </div>
          </Guidance>
        </FormSection>
      </ExpandableItem>
    );
  }
}

const getVariablesForNodeType = (state, nodeType) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

const mapAsOptions = keyValueObject =>
  map(
    keyValueObject,
    (value, key) => ({
      label: get(value, 'label', ''),
      value: key,
      color: get(value, 'color', ''),
    }),
  );

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, props.fieldId), 'subject.type');
  const variables = getVariablesForNodeType(state, nodeType);
  const layoutsForNodeType = toPairs(variables).filter(([, meta]) => meta.type === 'layout');
  const highlightableForNodeType = toPairs(variables).filter(([, meta]) => meta.type === 'boolean');
  const isFieldInvalid = isInvalid(props.form.name);

  return {
    layoutsForNodeType,
    highlightableForNodeType,
    variablesForNodeType: variables,
    isInvalid: isFieldInvalid(state, props.fieldId),
    hasSubmitFailed: hasSubmitFailed(props.form.name)(state),
    nodeTypes: mapAsOptions(getNodeTypes(state)),
    edgeTypes: mapAsOptions(state.protocol.present.variableRegistry.edge),
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  clearField: (fieldName) => {
    dispatch(clearFields(props.form.name, false, false, fieldName));
  },
});

export { SociogramPrompt };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  SociogramPrompt,
);
