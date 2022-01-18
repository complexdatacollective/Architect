import React from 'react';
import { Field, formValueSelector } from 'redux-form';
import { useSelector } from 'react-redux';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';
import {
  Filter as FilterQuery, withFieldConnector, withStoreConnector, ruleValidator,
} from '../Query';

const FilterField = withFieldConnector(withStoreConnector(FilterQuery));

const Filter = () => {
  const getFormValue = formValueSelector('edit-stage');
  const currentValue = useSelector((state) => getFormValue(state, 'filter'));

  return (
    <Section
      title="Filter"
      toggleable
      summary={(
        <p>
          You can optionally filter which nodes are shown on this stage, by creating
          one or more rules using the options below.
        </p>
      )}
      startExpanded={!!currentValue}
      handleToggleOff={() => {
        // eslint-disable-next-line no-alert
        if (window.confirm('Are you sure you want to remove the filter? This will remove all nodes from this stage.')) {
          return true;
        }

        return false;
      }}
    >
      <div id={getFieldId('filter')} data-name="Filter text" />
      <Field
        name="filter"
        component={FilterField}
        validate={ruleValidator}
      />
    </Section>
  );
};

export default Filter;
