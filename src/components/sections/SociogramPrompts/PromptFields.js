import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../Form';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import { Row, Group } from '../../OrderedList';
import withOptions from './withOptions';
import withFormHandlers from './withFormHandlers';

const disableBlur = event => event.preventDefault();

class PromptFields extends Component {
  static propTypes = {
    edgesForNodeType: PropTypes.array.isRequired,
    layoutVariablesForNodeType: PropTypes.array.isRequired,
    variablesForNodeType: PropTypes.object.isRequired,
    highlightVariablesForNodeType: PropTypes.array.isRequired,
    clearField: PropTypes.func.isRequired,
    clearFieldIfEmpty: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isInvalid: false,
    hasSubmitFailed: false,
  };

  handleChangeAllowHighlighting = () => {
    this.props.clearField('edges.create');
  };

  handleChangeCreateEdge = (event, value) => {
    this.props.clearField('highlight.allowHighlighting');
    this.props.clearFieldIfEmpty(event, 'edges.create', value);
  };

  handleChangeHighlightVariable = (event, value) => {
    this.props.clearFieldIfEmpty(event, 'highlight.variable', value);
  }

  render() {
    const {
      variablesForNodeType,
      layoutVariablesForNodeType,
      highlightVariablesForNodeType,
      edgesForNodeType,
    } = this.props;

    return (
      <div>
        <Guidance contentId="guidance.editor.sociogram_prompt.text">
          <Row>
            <h3 id={getFieldId('text')}>Prompt text</h3>
            <p>
              Enter the text to use for your prompt below. Remember that you can add emphasis to
              your prompt using markdown syntax.
            </p>
            <ValidatedField
              name="text"
              component={Fields.TextArea}
              label=""
              placeholder="Enter text for the prompt here"
              validation={{ required: true }}
            />
          </Row>
        </Guidance>
        <Guidance contentId="guidance.editor.sociogram_prompt.layout">
          <Group>
            <Row>
              <div id={getFieldId('layout.layoutVariable')} data-name="Layout Variable" />
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
                options={layoutVariablesForNodeType}
              />
            </Row>
          </Group>
        </Guidance>
        <Group>
          <Guidance contentId="guidance.editor.sociogram_prompt.sortOrder">
            <Row>
              <p>
                If you wish to customise the order that nodes are displayed in the bin before they
                are positioned, create one or more sorting rules below.
              </p>
              <Field
                name="sortOrder"
                component={ArchitectFields.OrderBy}
                variables={variablesForNodeType}
                label="Node bin sorting rules:"
              />
            </Row>
          </Guidance>
        </Group>
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
                onChange={this.handleChangeHighlightVariable}
                onBlur={disableBlur}
                placeholder="&mdash; Select a variable to highlight &mdash;"
                options={highlightVariablesForNodeType}
              />
            </Row>
            <Row>
              <Field
                name="highlight.allowHighlighting"
                component={Fields.Checkbox}
                label="Toggle this attribute by tapping on a node"
                onChange={this.handleChangeAllowHighlighting}
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
                options={edgesForNodeType}
                label="Display edges of the following type(s):"
              />
            </Row>
            <Row>
              <Field
                name="edges.create"
                component={ArchitectFields.Select}
                options={edgesForNodeType}
                onChange={this.handleChangeCreateEdge}
                onBlur={disableBlur}
                placeholder="&mdash; Select an edge type &mdash;"
                label="Create edges of the following type (this will disable attribute toggling):"
              />
            </Row>
          </Group>
        </Guidance>
      </div>
    );
  }
}

export { PromptFields };

export default compose(
  withOptions,
  withFormHandlers,
)(PromptFields);
