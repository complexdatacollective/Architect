import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { has } from 'lodash';
import { Field, change, getFormValues } from 'redux-form';
import { actionCreators as dialogActions } from '@modules/dialogs';
import { getFieldId } from '@app/utils/issues';
import ContextPanel from '@components/ContextPanel';
import {
  Filter as FilterQuery,
  withFieldConnector,
  withStoreConnector,
  ruleValidator,
} from '@components/Query';

const FilterField = withFieldConnector(withStoreConnector(FilterQuery));

const NetworkFilter = ({
  hasFilter,
  changeField,
  openDialog,
}) => {
  const handleDeactivate = useCallback(
    () =>
      openDialog({
        type: 'Warning',
        title: 'This will clear filter',
        confirmLabel: 'Clear filter',
      })
        .then((confirm) => {
          changeField('edit-stage', 'filter', {});
          return confirm;
        }),
    [openDialog, changeField],
  );

  return (
    <ContextPanel
      title="Filter (optional)"
      id={getFieldId('filter')}
      isActive={hasFilter}
      onDeactivate={handleDeactivate}
    >
      <p>
        You can optionally filter which nodes are shown on this stage, by creating
        one or more rules using the options below.
      </p>
      <Field
        name="filter"
        component={FilterField}
        validate={ruleValidator}
      />
    </ContextPanel>
  );
};

NetworkFilter.propTypes = {
  hasFilter: PropTypes.bool.isRequired,
  changeField: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  hasFilter: has(getFormValues('edit-stage')(state), 'filter'),
});

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
  changeField: change,
};

export { NetworkFilter };

export default connect(mapStateToProps, mapDispatchToProps)(NetworkFilter);
