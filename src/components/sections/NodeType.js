import React, { useCallback } from 'react';
import { difference, keys, get } from 'lodash';
import PropTypes from 'prop-types';
import { change, getFormValues } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import Section from '../EditorLayout/Section';
import Row from '../EditorLayout/Row';
import Filter from './Filter';
import EntitySelectField from './fields/EntitySelectField/EntitySelectField';
import ValidatedField from '../Form/ValidatedField';

export const SUBJECT_INDEPENDENT_FIELDS = ['id', 'type', 'label', 'interviewScript', 'introductionPanel']

const NodeType = (props) => {
  const {
    form,
    withFilter,
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

  return (
    <Section
      title="Node Type"
    >
      <Row>
        <ValidatedField
          name="subject"
          entityType="node"
          promptBeforeChange="You attempted to change the node type of a stage that you have already configured. Before you can proceed the stage must be reset, which will remove any existing configuration. Do you want to reset the stage now?"
          component={EntitySelectField}
          onChange={handleResetStage}
          parse={(value) => ({ type: value, entity: 'node' })}
          format={(value) => get(value, 'type')}
          validation={{ required: true }}
        />
      </Row>
      { withFilter && (
        <Row>
          <Filter
          // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        </Row>
      )}
    </Section>
  );
};

NodeType.propTypes = {
  form: PropTypes.string.isRequired,
  withFilter: PropTypes.bool,
};

NodeType.defaultProps = {
  withFilter: false,
};

// eslint-disable-next-line react/jsx-props-no-spreading
export const FilteredNodeType = (props) => <NodeType withFilter {...props} />;

export default NodeType;
