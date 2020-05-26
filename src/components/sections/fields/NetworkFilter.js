import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { has } from 'lodash';
import { Field, change, getFormValues } from 'redux-form';
import { compose, defaultProps } from 'recompose';
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
  name,
  title,
  variant,
}) => {
  const handleDeactivate = useCallback(
    () =>
      openDialog({
        type: 'Warning',
        title: 'This will clear your filter',
        message: 'This will clear your filter, and delete any rules you have created. Do you want to continue?',
        confirmLabel: 'Clear filter',
      })
        .then((confirm) => {
          if (confirm) {
            changeField('edit-stage', name, null);
          }
          return confirm;
        }),
    [openDialog, changeField],
  );

  return (
    <ContextPanel
      title={title}
      id={getFieldId(name)}
      isActive={hasFilter}
      onDeactivate={handleDeactivate}
      variant={variant}
    >
      <p>
        You can optionally filter which nodes are shown on this stage, by creating
        one or more rules using the options below.
      </p>
      <Field
        name={name}
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
  name: PropTypes.string.isRequired,
  variant: PropTypes.string,
  title: PropTypes.string,
};

NetworkFilter.defaultProps = {
  variant: null,
  title: 'Use network filter',
};

const mapStateToProps = (state, props) => ({
  hasFilter: has(getFormValues('edit-stage')(state), props.name),
});

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
  changeField: change,
};

export { NetworkFilter };

export default compose(
  defaultProps({ name: 'filter' }),
  connect(mapStateToProps, mapDispatchToProps),
)(NetworkFilter);
