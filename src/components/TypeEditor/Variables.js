import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import Items, { NewButton } from '../Items';
import Variable from './Variable';

const Variables = ({
  form,
  name,
  addNew,
}) => (
  <React.Fragment>
    <FieldArray
      name={name}
      component={Items}
      itemComponent={Variable}
      form={form}
    />

    <div className="type-editor__subsection">
      <NewButton onClick={addNew} />
    </div>
  </React.Fragment>
);

Variables.propTypes = {
  form: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  addNew: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, { form, name }) => ({
  addNew: bindActionCreators(
    () => arrayPush(
      form,
      name,
      {},
    ),
    dispatch,
  ),
});

export { Variables };

export default compose(
  connect(null, mapDispatchToProps),
)(Variables);
