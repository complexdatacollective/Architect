import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { getFormValues, Field, reduxForm } from 'redux-form';

class StageForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Interface Type</label>
          <Field name="type" component="select">
            <option />
            <option value="name-generator">Name Generator</option>
            <option value="ordinal-bin">Ordinal Bin</option>
            <option value="sociogram">Sociogram</option>
          </Field>
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <Field name="title" component="input" type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const formValues = getFormValues('stage')(state);

  if (!formValues) { return {}; }

  return {
    type: formValues.type,
  };
}

export default compose(
  reduxForm({
    form: 'stage',
  }),
  connect(mapStateToProps),
)(StageForm);
