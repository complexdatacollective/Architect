import React from 'react';
import PropTypes from 'prop-types';
import { Section, Row } from '@components/EditorLayout';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { getFieldId } from '../../utils/issues';
import DataSource from '../Form/Fields/DataSource';
import ValidatedField from '../Form/ValidatedField';
import withSubject from '../enhancers/withSubject';
import withDisabledSubjectRequired from '../enhancers/withDisabledSubjectRequired';

const withChangeDataSourceHandler = connect(
  null,
  { changeForm: change },
);

const ExternalDataSource = (props) => {
  const handleChangeDataSource = () => {
    props.changeForm('edit-stage', 'cardOptions', {});
    props.changeForm('edit-stage', 'sortOptions', {});
  };

  return (
    <Section {...props}>
      <Row>
        <h3>External Data Source for Roster</h3>
        <div id={getFieldId('dataSource')} data-name="Roster data-source" />
        <p>
          This stage needs a source of nodes to populate the roster.
          Select a network data file to use.
        </p>
        <ValidatedField
          component={DataSource}
          name="dataSource"
          id="dataSource"
          validation={{ required: true }}
          onChange={handleChangeDataSource}
        />
      </Row>
    </Section>
  );
};

ExternalDataSource.propTypes = {
  changeForm: PropTypes.func.isRequired,
};

export { ExternalDataSource };

export default compose(
  withChangeDataSourceHandler,
  withSubject,
  withDisabledSubjectRequired,
)(ExternalDataSource);

