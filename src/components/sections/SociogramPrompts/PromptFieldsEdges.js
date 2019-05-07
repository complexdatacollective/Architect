import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import DetachedField from '../../DetachedField';
import Row from '../Row';
import Section from '../Section';
import withEdgesOptions from './withEdgesOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';
import withCreateEdgeHandlers from '../../enhancers/withCreateEdgeHandler';
import { ValidatedField } from '../../Form';

const EdgeFields = ({
  edgesForSubject,
  handleEdgeHighlightChange,
  handleCreateEdge,
  allowHighlighting,
  canCreateEdge,
  setCanCreateEdge,
}) => {
  const handleToggleCreateEdge = (value) => {
    setCanCreateEdge(!canCreateEdge);
    handleEdgeHighlightChange(value, 'edge');
  };

  return (
    <Section contentId="guidance.editor.sociogram_prompt.edges" group>
      <Row>
        <h3>Edges</h3>
        <p>
          This section controls edge creation and display. You can choose to display one or
          more edge types, and also allow the participant to create an edge of a given type.
        </p>
      </Row>
      <Row>
        <DetachedField
          component={Fields.Toggle}
          value={canCreateEdge}
          onChange={handleToggleCreateEdge}
          label="Create edges by tapping on a node?"
          disabled={allowHighlighting}
          title={allowHighlighting && 'Allow highlighting must be disabled to create edge'}
        />
      </Row>
      { canCreateEdge &&
        <Row>
          <ValidatedField
            name="edges.create"
            component={ArchitectFields.CreatableSelect}
            options={edgesForSubject}
            onCreateOption={handleCreateEdge}
            placeholder="&mdash; Select an edge type, or type to create a new one &mdash;"
            label="Create edges of the following type"
            validation={{ required: true }}
          />
        </Row>
      }
      <Row>
        { edgesForSubject.length > 0 ?
          (
            <Field
              name="edges.display"
              component={Fields.CheckboxGroup}
              options={edgesForSubject}
              label="Display edges of the following type(s):"
            />
          ) : (
            <React.Fragment>
              <h4>No edge types defined.</h4>
              <p>Create some edge types elsewhere in your interview, and they will appear here.</p>
            </React.Fragment>
          )
        }
      </Row>
    </Section>
  );
};

EdgeFields.propTypes = {
  edgesForSubject: PropTypes.array.isRequired,
  handleEdgeHighlightChange: PropTypes.func.isRequired,
  handleCreateEdge: PropTypes.func.isRequired,
  setCanCreateEdge: PropTypes.func.isRequired,
  canCreateEdge: PropTypes.bool.isRequired,
  allowHighlighting: PropTypes.bool.isRequired,
};

export { EdgeFields };

export default compose(
  withEdgesOptions,
  withEdgeHighlightChangeHandler,
  withCreateEdgeHandlers,
)(EdgeFields);
