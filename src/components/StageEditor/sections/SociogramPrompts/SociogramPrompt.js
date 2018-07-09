import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field, clearFields, isDirty, FormSection } from 'redux-form';
import { keys, get, toPairs, isEmpty } from 'lodash';
import Guidance from '../../../Guidance';
import Node from '../../../../ui/components/Node';
import { ValidatedField } from '../../../Form';
import * as Fields from '../../../Form/Fields';
import ExpandableItem from '../../Sortable/ExpandableItem';

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
    isDirty: PropTypes.bool,
  };

  static defaultProps = {
    isDirty: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundType: CONCENTRIC_CIRCLES,
    };
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
        open={this.props.isDirty}
        preview={(
          <FormSection name={fieldId}>
            <div className="stage-editor-section-sociogram-prompt__preview">
              <div className="stage-editor-section-sociogram-prompt__preview-icon">
                <Field
                  name="subject.type"
                  component={field => (<Node label={field.input.value} />)}
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
          <div className="stage-editor-section-prompt__group">
            <ValidatedField
              name="text"
              component={Fields.TextArea}
              className="stage-editor-section-prompt__setting"
              label="Text for prompt"
              placeholder="Enter text for the prompt here"
              validation={{ required: true }}
            />
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Nodes</h4>
            <ValidatedField
              name="subject"
              component={Fields.Contexts}
              className="stage-editor-section-prompt__setting"
              parse={value => ({ type: value, entity: 'node' })}
              format={value => get(value, 'type')}
              options={nodeTypes}
              label="Which node would you like to layout?"
              validation={{ hasSubject }}
            />
            <Guidance contentId="guidance.editor.sociogram_prompt.sortOrderBy">
              <div>
                <Field
                  name="sortOrderBy"
                  component={Fields.OrderBy}
                  className="stage-editor-section-prompt__setting"
                  variables={variablesForNodeType}
                  label="How would you like to sort the node bin?"
                />
              </div>
            </Guidance>
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Layout</h4>
            <ValidatedField
              name="layout.variable"
              component={Fields.Select}
              className="stage-editor-section-prompt__setting"
              label="Layout variable"
              validation={{ required: true }}
            >
              <option disabled value="">Select one</option>
              {layoutsForNodeType.map(([variableName, meta]) => (
                <option value={variableName} key={variableName}>{meta.label}</option>
              ))}
            </ValidatedField>
            <Field
              name="layout.allowPositioning"
              component={Fields.Checkbox}
              className="stage-editor-section-prompt__setting"
              label="Allow positioning?"
            />
          </div>

          <Guidance contentId="guidance.editor.sociogram_prompt.attributes">
            <div className="stage-editor-section-prompt__group">
              <h4 className="stage-editor-section-prompt__group-title">Attributes</h4>
              <Field
                name="highlight.variable"
                component={Fields.Select}
                className="stage-editor-section-prompt__setting"
                label="Would you like to highlight nodes based on any attribute?"
                onChange={this.clearEmptyField}
                onBlur={disableBlur}
              >
                <option disabled value="">Select one</option>
                {highlightableForNodeType.map(([variableName, meta]) => (
                  <option value={variableName} key={variableName}>{meta.label}</option>
                ))}
              </Field>
              <Field
                name="highlight.allowHighlighting"
                component={Fields.Checkbox}
                className="stage-editor-section-prompt__setting"
                label="Click a node to toggle this attribute (disables edge creation)"
                onChange={() => this.handleHighlightOrCreateEdge(HIGHLIGHT)}
              />
            </div>
          </Guidance>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Edges</h4>
            <Field
              name="edges.display"
              component={Fields.CheckboxList}
              className="stage-editor-section-prompt__setting"
              options={edgeTypes}
              label="Which edges would you like to show?"
            />
            <Field
              name="edges.create"
              component={Fields.Select}
              className="stage-editor-section-prompt__setting"
              options={['', ...edgeTypes]}
              onChange={(...args) => {
                this.clearEmptyField(...args);
                this.handleHighlightOrCreateEdge(CREATE_EDGE);
              }}
              onBlur={disableBlur}
              label="Click nodes to create an edge? (disables attribute toggling)"
            />
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Background</h4>
            <Fields.Mode
              label="Choose a background type"
              className="stage-editor-section-prompt__setting"
              options={[
                [CONCENTRIC_CIRCLES, 'Circles'],
                [BACKGROUND_IMAGE, 'Image'],
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
                  label="How many circles?"
                  type="number"
                  placeholder="5"
                />
                <Field
                  name="background.skewedTowardCenter"
                  component={Fields.Checkbox}
                  className="stage-editor-section-prompt__setting"
                  label="Skewed towards center?"
                />
              </Fragment>
            }
            { (backgroundType === BACKGROUND_IMAGE) &&
              <div style={{ position: 'relative', minHeight: '100px' }}>
                <Field
                  name="background.image"
                  component={Fields.Image}
                  className="stage-editor-section-prompt__setting"
                  label="Background image"
                />
              </div>
            }
          </div>
        </FormSection>
      </ExpandableItem>
    );
  }
}

const getVariablesForNodeType = (state, nodeType) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, props.fieldId), 'subject.type');
  const variables = getVariablesForNodeType(state, nodeType);
  const layoutsForNodeType = toPairs(variables).filter(([, meta]) => meta.type === 'layout');
  const highlightableForNodeType = toPairs(variables).filter(([, meta]) => meta.type === 'boolean');
  const isFieldDirty = isDirty(props.form.name);

  return {
    layoutsForNodeType,
    highlightableForNodeType,
    variablesForNodeType: variables,
    isDirty: isFieldDirty(state, props.fieldId),
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    edgeTypes: keys(state.protocol.present.variableRegistry.edge),
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
