import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import CreatableSelect from '@components/Form/Fields/CreatableSelect';
import DetachedField from '@components/DetachedField';
import withCreateEdgeHandlers from '@components/enhancers/withCreateEdgeHandler';
import { ValidatedField } from '@components/Form';
import Tip from '@components/Tip';
import withEdgesOptions from './withEdgesOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';

const EdgeFields = ({
  edgesForSubject,
  displayEdgesOptions,
  handleEdgeHighlightChange,
  handleCreateEdge,
  handleChangeCreateEdge,
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
        <h3>Edge Display and Creation</h3>
        <p>
          This section controls edge display and creation. You can choose to display one or
          more edge types, and also allow the participant to create an edge of a given type.
        </p>
      </Row>
      <Row>
        <h4>Enable Edge Creation</h4>
        <p>
          The sociogram can be configured to allow the participant to create edges by
          consecutively tapping nodes.
        </p>
        <Tip>
          <p>
            You cannot use this setting at the same time
            as the &quot;Variable toggling&quot; option below. Enabling this setting will
            disable that option.
          </p>
        </Tip>
        <DetachedField
          component={Fields.Toggle}
          value={canCreateEdge}
          onChange={handleToggleCreateEdge}
          label="Create edges by tapping on a node"
          disabled={allowHighlighting}
          title={allowHighlighting && 'Allow highlighting must be disabled to create edge'}
        />
      </Row>
      <Row disabled={!canCreateEdge}>
        { canCreateEdge &&
          <ValidatedField
            name="edges.create"
            component={CreatableSelect}
            options={edgesForSubject}
            onCreateOption={handleCreateEdge}
            onChange={handleChangeCreateEdge}
            placeholder="&mdash; Select an edge type from the list, or type a name to create a new one &mdash;"
            label="Create edges of the following type"
            validation={{ required: true, allowedNMToken: 'edge type name' }}
            formatCreateLabel={inputValue => (
              <span>Click here to create a edge type named &quot;{inputValue}&quot;.</span>
            )}
          />
        }
      </Row>
      <Row disabled={edgesForSubject.length === 0}>
        { edgesForSubject.length > 0 &&
          <Field
            name="edges.display"
            component={Fields.CheckboxGroup}
            options={displayEdgesOptions}
            label="Display edges of the following type(s):"
          />
        }
      </Row>
    </Section>
  );
};

EdgeFields.propTypes = {
  edgesForSubject: PropTypes.array.isRequired,
  displayEdgesOptions: PropTypes.array.isRequired,
  handleEdgeHighlightChange: PropTypes.func.isRequired,
  handleCreateEdge: PropTypes.func.isRequired,
  handleChangeCreateEdge: PropTypes.func.isRequired,
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
