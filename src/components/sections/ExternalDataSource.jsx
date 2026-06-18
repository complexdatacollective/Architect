import { Row, Section } from '@components/EditorLayout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { change } from 'redux-form';

import withDisabledSubjectRequired from '../enhancers/withDisabledSubjectRequired';
import withSubject from '../enhancers/withSubject';
import DataSource from '../Form/Fields/DataSource';
import ValidatedField from '../Form/ValidatedField';

const withChangeDataSourceHandler = connect(null, { changeForm: change });

const ExternalDataSource = (props) => {
  const handleChangeDataSource = () => {
    props.changeForm('edit-stage', 'cardOptions', {});
    props.changeForm('edit-stage', 'sortOptions', {});
  };

  return (
    <Section
      title="Data source for Roster"
      summary={
        <p>
          This stage needs a source of nodes to populate the roster. Select a
          network data file to use.
        </p>
      }
      {...props}
    >
      <Row>
        <ValidatedField
          issueDescription="Data source for Roster"
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

export default compose(
  withChangeDataSourceHandler,
  withSubject,
  withDisabledSubjectRequired,
)(ExternalDataSource);
