/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { union } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { change, Field, formValueSelector } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import Tip from '../../Tip';
import { getEdgesForSubject } from './selectors';

const DisplayEdges = ({ form, entity, type }) => {
  const dispatch = useDispatch();
  const edgesForSubject = useSelector((state) => getEdgesForSubject(state, { entity, type }));
  const createEdge = useSelector((state) => formValueSelector(form)(state, 'edges.create'));
  const displayEdges = useSelector((state) => formValueSelector(form)(state, 'edges.display'));

  const displayEdgesOptions = edgesForSubject.map((edge) => {
    if (edge.value !== createEdge) { return edge; }
    return {
      ...edge,
      disabled: true,
    };
  });

  const hasDisabledEdgeOption = displayEdgesOptions.some((option) => option.disabled);

  useEffect(() => {
    const displayEdgesWithCreatedEdge = union(displayEdges, [createEdge]);
    dispatch(change(form, 'edges.display', displayEdgesWithCreatedEdge));
  }, [createEdge]);

  return (
    <>
      <Section
        title="Display Edges"
        summary={(
          <p>
            You can display one or more edge types on this prompt. Where two nodes are connected
            by multiple edge types, only one of those edge types will be displayed.
          </p>
        )}
      >
        <Row disabled={edgesForSubject.length === 0}>
          { hasDisabledEdgeOption && (
            <Tip>
              <p>
                The edge type being created must always be displayed. This
                edge type is shown in italics below, and cannot be deselected.
              </p>
            </Tip>
          )}
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
    </>
  );
};

DisplayEdges.propTypes = {
  form: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default DisplayEdges;
