import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Section, Row } from '@components/EditorLayout';
import { difference, keys, get } from 'lodash';
import { change, getFormValues } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import Filter from './Filter';
import { ValidatedField } from '../Form';
import EntitySelectField from './fields/EntitySelectField/EntitySelectField';
import { SUBJECT_INDEPENDENT_FIELDS } from './NodeType';
import { makeScreenMessageListener } from '../../selectors/ui';

const FilteredEdgeType = (props) => {
  const {
    form,
  } = props;

  const dispatch = useDispatch();
  const formValues = useSelector((state) => getFormValues(form)(state));
  const fields = keys(formValues);

  const handleResetStage = useCallback(
    () => {
      const fieldsToReset = difference(fields, SUBJECT_INDEPENDENT_FIELDS);
      fieldsToReset.forEach((field) => dispatch(change(form, field, null)));
    },
  );

  const currentSubject = get(formValues, 'subject');

  const screenMessageListener = makeScreenMessageListener('type');
  const typeScreenMessage = useSelector((state) => screenMessageListener(state));

  // Automatically switch to a newly created stage subject if
  // there are no existing subjects.
  useEffect(() => {
    // Message is sent by the new entity screen dialog.
    // If it is empty, we don't need to do anything.
    // If there is a subject, we also don't do anything
    if (!typeScreenMessage || currentSubject) { return; }

    const { type } = typeScreenMessage;
    dispatch(change(form, 'subject', { entity: 'edge', type }));
  }, [typeScreenMessage]);

  return (
    <Section title="Edge Type">
      <Row>
        <ValidatedField
          name="subject"
          entityType="edge"
          issueDescription="Edge Type"
          promptBeforeChange="You attempted to change the edge type of a stage that you have already configured. Before you can proceed the stage must be reset, which will remove any existing configuration. Do you want to reset the stage now?"
          component={EntitySelectField}
          onChange={handleResetStage}
          parse={(value) => ({ type: value, entity: 'edge' })}
          format={(value) => get(value, 'type')}
          validation={{ required: true }}
        />
      </Row>
      <Filter
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Section>
  );
};

FilteredEdgeType.propTypes = {
  form: PropTypes.string.isRequired,
};

export default FilteredEdgeType;
