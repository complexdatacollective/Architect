import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, clearFields, isInvalid, FormSection, hasSubmitFailed } from 'redux-form';
import { get, toPairs, isEmpty, map } from 'lodash';
import { getNodeTypes } from '../../../../selectors/variableRegistry';
import Guidance from '../../../Guidance';
import { ValidatedField } from '../../../Form';
import * as ArchitectFields from '../../../Form/Fields';
import * as Fields from '../../../../ui/components/Fields';
import { Row, Group } from '../../../OrderedList';
import Form from '../../../Prompts/PromptForm';
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

class PromptForm extends Form {
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

  form() {
    const { backgroundType } = this.state;
    const {
      fieldId,
      nodeTypes,
      edgeTypes,
      variablesForNodeType,
      layoutsForNodeType,
      highlightableForNodeType,
    } = this.props;

    return (
      <FormSection name={fieldId}>
        <Guidance contentId="guidance.editor.sociogram_prompt.text">
          <Row>
            <h3>Prompt text</h3>
            <p>
              Enter the text to use for your prompt below. Remember that you can add emphasis to
              your prompt using markdown syntax.
            </p>
            <div id={getFieldId(`${fieldId}.text`)} data-name="Prompt text" />
            <ValidatedField
              name="text"
              component={Fields.TextArea}
              label=""
              placeholder="Enter text for the prompt here"
              validation={{ required: true }}
            />
          </Row>
        </Guidance>
        <Group>
          <Guidance contentId="guidance.editor.sociogram_prompt.nodes">
            <Row>
              <div id={getFieldId(`${fieldId}.subject`)} data-name="Prompt node type" />
              <h3>Nodes</h3>
              <p>
                Select the type of node to be displayed on this prompt.
              </p>
              <ValidatedField
                name="subject"
                component={ArchitectFields.NodeSelect}
                className="stage-editor-section-prompt__setting"
                parse={value => ({ type: value, entity: 'node' })}
                format={value => get(value, 'type')}
                options={nodeTypes}
                label=""
                validation={{ hasSubject }}
              />
            </Row>
          </Guidance>
          <Guidance contentId="guidance.editor.sociogram_prompt.sortOrder">
            <Row>
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
            </Row>
          </Guidance>
        </Group>
        <Guidance contentId="guidance.editor.sociogram_prompt.background">
          <Group>
            <Row>
              <h3>Background</h3>
              <p>
                This section determines the graphical background for this prompt. You can choose
                between a conventional series of concentric circles, or provide your own
                background image.
              </p>
            </Row>
            <Row>
              <ArchitectFields.Mode
                label="Choose a background type"
                options={[
                  { value: CONCENTRIC_CIRCLES, label: 'Circles' },
                  { value: BACKGROUND_IMAGE, label: 'Image' },
                ]}
                input={{
                  value: backgroundType,
                  onChange: this.handleChooseBackgroundType,
                }}
              />
            </Row>
            { (backgroundType === CONCENTRIC_CIRCLES) &&
              <Fragment>
                <Row>
                  <Field
                    name="background.concentricCircles"
                    component={Fields.Text}
                    label="Number of concentric circles to use:"
                    type="number"
                    placeholder="3"
                    normalize={value => parseInt(value, 10)}
                  />
                </Row>
                <Row>
                  <Field
                    name="background.skewedTowardCenter"
                    component={Fields.Checkbox}
                    label="Skew the size of the circles so that the middle is proportionally larger."
                  />
                </Row>
              </Fragment>
            }
            { (backgroundType === BACKGROUND_IMAGE) &&
              <Row>
                <div style={{ position: 'relative', minHeight: '100px' }}>
                  <Field
                    name="background.image"
                    component={ArchitectFields.Image}
                    label="Background image"
                  />
                </div>
              </Row>
            }
          </Group>
        </Guidance>
        <Guidance contentId="guidance.editor.sociogram_prompt.layout">
          <Group>
            <Row>
              <div id={getFieldId(`${fieldId}.layout.layoutVariable`)} data-name="Prompt layout variable" />
              <h3>Layout</h3>
              <p>
                This section controls the position of nodes on this sociogram prompt. Decide
                if you want the participant to be able to drag nodes to position them, and
                select a layout variable to use for storing or retrieving position data.
              </p>
            </Row>
            <Row>
              <Field
                name="layout.allowPositioning"
                component={Fields.Checkbox}
                label="Allow dragging nodes to position them?"
              />
            </Row>
            <Row>
              <ValidatedField
                name="layout.layoutVariable"
                component={ArchitectFields.Select}
                label="Layout variable"
                placeholder="&mdash; Select a layout variable &mdash;"
                validation={{ required: true }}
                options={layoutsForNodeType.map(([variableId, meta]) => (
                  { value: variableId, label: meta.label }
                ))}
              />
            </Row>
          </Group>
        </Guidance>

        <Guidance contentId="guidance.editor.sociogram_prompt.attributes">
          <Group>
            <Row>
              <h3>Attributes</h3>
              <p>
                Use this section to configure node highlighting. Choose a
                boolean variable below, and nodes with this attribute will
                automatically be highlighted. You can also allow the
                participant to toggle this attribute by simply tapping (or
                clicking) a node.
              </p>
            </Row>
            <Row>
              <Field
                name="highlight.variable"
                component={ArchitectFields.Select}
                label="Highlight nodes with the following attribute:"
                onChange={this.clearEmptyField}
                onBlur={disableBlur}
                placeholder="&mdash; Select a variable to highlight &mdash;"
                options={highlightableForNodeType.map(([variableName, meta]) => (
                  { value: variableName, label: meta.label }
                ))}
              />
            </Row>
            <Row>
              <Field
                name="highlight.allowHighlighting"
                component={Fields.Checkbox}
                label="Toggle this attribute by tapping on a node"
                onChange={() => this.handleHighlightOrCreateEdge(HIGHLIGHT)}
              />
            </Row>
          </Group>
        </Guidance>
        <Guidance contentId="guidance.editor.sociogram_prompt.edges">
          <Group>
            <Row>
              <h3>Edges</h3>
              <p>
                This section controls edge creation and display. You can choose to display one or
                more edge types, and also allow the participant to create an edge of a given type.
              </p>
            </Row>
            <Row>
              <Field
                name="edges.display"
                component={Fields.CheckboxGroup}
                options={edgeTypes}
                label="Display edges of the following type(s):"
              />
            </Row>
            <Row>
              <Field
                name="edges.create"
                component={ArchitectFields.Select}
                options={edgeTypes}
                onChange={(...args) => {
                  this.clearEmptyField(...args);
                  this.handleHighlightOrCreateEdge(CREATE_EDGE);
                }}
                onBlur={disableBlur}
                placeholder="&mdash; Select an edge type &mdash;"
                label="Create edges of the following type (this will disable attribute toggling):"
              />
            </Row>
          </Group>
        </Guidance>
      </FormSection>
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

export { PromptForm };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  PromptForm,
);
