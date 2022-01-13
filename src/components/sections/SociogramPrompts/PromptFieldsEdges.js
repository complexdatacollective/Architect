/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import DetachedField from '@components/DetachedField';
import withCreateEdgeHandlers from '@components/enhancers/withCreateEdgeHandler';
import { ValidatedField } from '@components/Form';
import Tip from '@components/Tip';
import withEdgesOptions from './withEdgesOptions';
import withEdgeHighlightChangeHandler from './withEdgeHighlightChangeHandler';
import PromptFieldsHighlight from './PromptFieldsHighlight';

const EdgeFields = (props) => {
  const {
    edgesForSubject,
    displayEdgesOptions,
    handleEdgeHighlightChange,
    handleCreateEdge,
    handleChangeCreateEdge,
    allowHighlighting,
    canCreateEdge,
    setCanCreateEdge,
  } = props;

  const handleToggleCreateEdge = (value) => {
    setCanCreateEdge(!canCreateEdge);
    handleEdgeHighlightChange(value, 'edge');
  };

  return (
    <>
      <Section
        title="Edge Creation"
        summary={(
          <p>
            The sociogram can be configured to allow the participant to create edges by
            consecutively tapping nodes.
          </p>
        )}
      >
        <Row>
          <h4 className="form-field-label">Enable Edge Creation</h4>
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
            title={allowHighlighting ? 'Allow highlighting must be disabled to create edge' : ''}
          />
        </Row>
        <Row disabled={!canCreateEdge}>
          { canCreateEdge
            && (
            <ValidatedField
              name="edges.create"
              component={NativeSelect}
              options={edgesForSubject}
              onCreateOption={(option) => {
                handleChangeCreateEdge(handleCreateEdge(option));
              }}
              onChange={handleChangeCreateEdge}
              placeholder="Select or create an edge type"
              createLabelText="✨ Create new edge type ✨"
              createInputLabel="New edge type name"
              createInputPlaceholder="Enter an edge type..."
              label="Create edges of the following type"
              validation={{ required: true, allowedNMToken: 'edge type name' }}
            />
            )}
        </Row>
        <Row disabled={edgesForSubject.length === 0}>
          { edgesForSubject.length > 0
            && (
            <Field
              name="edges.display"
              component={Fields.CheckboxGroup}
              options={displayEdgesOptions}
              label="Display edges of the following type(s)"
            />
            )}
        </Row>
      </Section>
      <PromptFieldsHighlight {...props} />
    </>
  );
};

EdgeFields.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  edgesForSubject: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  displayEdgesOptions: PropTypes.array.isRequired,
  handleEdgeHighlightChange: PropTypes.func.isRequired,
  handleCreateEdge: PropTypes.func.isRequired,
  handleChangeCreateEdge: PropTypes.func.isRequired,
  setCanCreateEdge: PropTypes.func.isRequired,
  canCreateEdge: PropTypes.bool.isRequired,
  allowHighlighting: PropTypes.bool,
};

EdgeFields.defaultProps = {
  allowHighlighting: false,
};

export { EdgeFields };

export default compose(
  withEdgesOptions,
  withEdgeHighlightChangeHandler,
  withCreateEdgeHandlers,
)(EdgeFields);
