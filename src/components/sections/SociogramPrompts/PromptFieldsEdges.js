import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import Guidance from '../../Guidance';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import DetachedField from '../../DetachedField';
import { Row } from '../../OrderedList';
import Section from '../Section';
import withEdgesOptions from './withEdgesOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';
import withCreateEdgeHandlers from '../../enhancers/withCreateEdgeHandler';

const EdgeFields = ({
  edgesForNodeType,
  handleEdgeHighlightChange,
  handleCreateEdge,
  canCreateEdge,
  setCanCreateEdge,
}) => {
  const handleToggleCreateEdge = (value) => {
    setCanCreateEdge(!canCreateEdge);
    handleEdgeHighlightChange(value, 'edge');
  };

  return (
    <Guidance contentId="guidance.editor.sociogram_prompt.edges">
      <Section group>
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
          <DetachedField
            component={Fields.Toggle}
            value={canCreateEdge}
            onChange={handleToggleCreateEdge}
            label="Create edges by tapping on a node"
          />
        </Row>
        { canCreateEdge &&
          <Row>
            <Field
              name="edges.create"
              component={ArchitectFields.CreatableSelect}
              options={edgesForNodeType}
              onCreateOption={handleCreateEdge}
              placeholder="&mdash; Select or create a new edge type &mdash;"
              label="Create edges of the following type"
            />
          </Row>
        }
      </Section>
    </Guidance>
  );
};

EdgeFields.propTypes = {
  edgesForNodeType: PropTypes.array.isRequired,
  handleEdgeHighlightChange: PropTypes.func.isRequired,
  handleCreateEdge: PropTypes.func.isRequired,
  setCanCreateEdge: PropTypes.func.isRequired,
  canCreateEdge: PropTypes.bool.isRequired,
};

export { EdgeFields };

export default compose(
  withEdgesOptions,
  withEdgeHighlightChangeHandler,
  withCreateEdgeHandlers,
)(EdgeFields);
