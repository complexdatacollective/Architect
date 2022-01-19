import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Text } from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { useDispatch, useSelector } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import MultiSelect from '@components/Form/MultiSelect';
import withMapFormToProps from '@components/enhancers/withMapFormToProps';
import withDisabledAssetRequired from '@components/enhancers/withDisabledAssetRequired';
import useVariablesFromExternalData from '@hooks/useVariablesFromExternalData';
import getVariableOptionsGetter from './getVariableOptionsGetter';
import getSortOrderOptionGetter from './getSortOrderOptionGetter';

const SortOptions = ({
  dataSource,
  disabled,
}) => {
  const { variables: variableOptions } = useVariablesFromExternalData(dataSource, true);
  const variableOptionsGetter = getVariableOptionsGetter(variableOptions);
  const maxVariableOptions = variableOptions.length;
  const sortOrderOptionGetter = getSortOrderOptionGetter(variableOptions);

  const dispatch = useDispatch();
  const getFormValue = formValueSelector('edit-stage');
  const hasInitialSortOrder = useSelector((state) => getFormValue(state, 'sortOptions.sortOrder'));
  const hasParticipantSortableProperties = useSelector((state) => getFormValue(state, 'sortOptions.sortableProperties'));

  const handleToggleInitialSortOrder = (nextState) => {
    if (nextState === false) {
      dispatch(change('edit-stage', 'sortOptions.sortOrder', null));
    }

    return true;
  };

  const handleToggleParticipantSortableProps = (nextState) => {
    if (nextState === false) {
      dispatch(change('edit-stage', 'sortOptions.sortableProperties', null));
    }

    return true;
  };

  return (
    <>
      <Section
        toggleable
        title="Initial Sort Order"
        disabled={disabled}
        startExpanded={!!hasInitialSortOrder}
        handleToggleChange={handleToggleInitialSortOrder}
        summary={(
          <p>
            Create one or more rules to determine the default sort order or the roster,
            when it is first shown to the participant. By default, Interviewer will
            use the order that nodes are defined in your data file.
          </p>
        )}
      >
        <MultiSelect
          name="sortOptions.sortOrder"
          maxItems={1}
          properties={[
            { fieldName: 'property' },
            { fieldName: 'direction' },
          ]}
          options={sortOrderOptionGetter}
        />
      </Section>
      <Section
        toggleable
        disabled={disabled}
        title="Participant Sortable Properties"
        summary={(
          <p>
            This interface allows the participant to sort the roster, to help with locating
            a specific member. Select one or more attributes from your roster that the
            participant can use to sort the list.
          </p>
        )}
        startExpanded={!!hasParticipantSortableProperties}
        handleToggleChange={handleToggleParticipantSortableProps}
      >
        <MultiSelect
          name="sortOptions.sortableProperties"
          maxItems={maxVariableOptions}
          properties={[
            { fieldName: 'variable' },
            {
              fieldName: 'label',
              component: Text,
              placeholder: 'Label',
            },
          ]}
          options={variableOptionsGetter}
        />
      </Section>
    </>
  );
};

SortOptions.propTypes = {
  dataSource: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export { SortOptions };

export default compose(
  withMapFormToProps('dataSource'),
  withDisabledAssetRequired,
)(SortOptions);
