import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Field, change, getFormValues } from 'redux-form';
import { compose, defaultProps } from 'recompose';
import { actionCreators as dialogActions } from '@modules/dialogs';
import {
  Filter as FilterQuery,
  withFieldConnector,
  withStoreConnector,
  ruleValidator,
} from '@components/Query';
import { handleFilterDeactivate } from '../Filter';
import Section from '../../EditorLayout/Section';

const FilterField = withFieldConnector(withStoreConnector(FilterQuery));

const NetworkFilter = ({
  form,
  hasFilter,
  changeField,
  openDialog,
  name,
}) => {
  const handleToggleChange = useCallback(
    async (newStatus) => {
      if (newStatus === true) {
        return Promise.resolve(true);
      }

      if (hasFilter) {
        const result = await handleFilterDeactivate(openDialog);

        if (!result) {
          return Promise.resolve(false);
        }
      }

      changeField(form, name, null);
      return Promise.resolve(true);
    },
    [openDialog, changeField],
  );

  return (
    <Section
      title="Filter"
      toggleable
      summary={(
        <p>
          You can optionally filter which nodes are shown on in this panel.
        </p>
      )}
      startExpanded={!!hasFilter}
      handleToggleChange={handleToggleChange}
    >
      <Field
        name={name}
        component={FilterField}
        validate={ruleValidator}
      />
    </Section>
  );
};

NetworkFilter.propTypes = {
  form: PropTypes.string.isRequired,
  hasFilter: PropTypes.bool.isRequired,
  changeField: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

NetworkFilter.defaultProps = {
};

const mapStateToProps = (state, props) => ({
  hasFilter: get(getFormValues(props.form)(state), props.name, null) !== null,
});

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
  changeField: change,
};

export default compose(
  defaultProps({ name: 'filter' }),
  connect(mapStateToProps, mapDispatchToProps),
)(NetworkFilter);
