import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Fuse from 'fuse.js';
import { NewButton } from '../Items';
import Variable from './Variable';
import List from '../List';

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'name',
    'description',
  ],
};

const search = (list, { query }) => {
  if (!query) { return list; }
  const fuse = new Fuse(list, fuseOptions);
  return fuse.search(query);
};

class Variables extends Component {
  handleSort = () => {
  }

  handleDelete = () => {
  }

  render() {
    const {
      form,
      name,
      addNew,
      variables,
    } = this.props;

    return (
      <React.Fragment>
        <div className="items">
          <div className="items__items">
            <List
              items={variables}
              search={search}
              form={form}
              name={name}
              onSort={this.handleSort}
              onDelete={this.handleDelete}
              component={Variable}
            />
          </div>
        </div>

        <div className="editor__subsection">
          <NewButton onClick={addNew} />
        </div>
      </React.Fragment>
    );
  }
}

Variables.propTypes = {
  form: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  addNew: PropTypes.func.isRequired,
  variables: PropTypes.array,
};

Variables.defaultProps = {
  variables: [],
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
