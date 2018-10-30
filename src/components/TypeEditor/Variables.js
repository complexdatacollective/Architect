import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { NewButton } from '../Items';
import Variable from './Variable';
import List from '../List';

const filter = ({ query }) => variable => {
  console.log({ query, variable });
  return !query || variable.name.includes(query);
}

const Variables = ({
  form,
  name,
  addNew,
  variables,
}) => (
  <React.Fragment>
    <div className="items">
      <div className="items__items">
        <List
          items={variables}
          filter={filter}
          component={({ item, index }) => (
            <Variable
              fieldId={`${name}[${index}]`} // we need the "real" index for redux form to work
              form={form}
              {...item}
            />
          )}
        />
      </div>
    </div>

    <div className="editor__subsection">
      <NewButton onClick={addNew} />
    </div>
  </React.Fragment>
);

Variables.propTypes = {
  form: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  addNew: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  variables: formValueSelector(props.form)(state, props.name),
});

const mapDispatchToProps = (dispatch, { form, name }) => ({
  addNew: bindActionCreators(
    () => arrayPush(
      form,
      name,
      { id: uuid() },
    ),
    dispatch,
  ),
});

export { Variables };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Variables);
