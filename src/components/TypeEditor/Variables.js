/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Fuse from 'fuse.js';
import { orderBy } from 'lodash';
import { NewButton } from '../Items';
import Variable from './Variable';
import { FieldArrayAdapter as List } from '../List';

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

const search = (list, query) => {
  if (!query) { return list; }
  const fuse = new Fuse(list, fuseOptions);
  return fuse.search(query);
};

const sort = (list, sortOrder) => {
  if (!sortOrder) { return list; }
  const properties = sortOrder.map(({ property }) => property);
  const orders = sortOrder.map(({ direction }) => direction);
  return orderBy(list, properties, orders);
};

const filter = (list, { query, sortOrder }) => {
  return sort(search(list, query), sortOrder);
};

class Variables extends Component {
  render() {
    const {
      form,
      name,
      addNew,
    } = this.props;

    return (
      <React.Fragment>
        <div className="items">
          <div className="items__items">
            <FieldArray
              component={List}
              item={Variable}
              name={name}
              form={form}
              sortable={false} // manual sort
              filter={filter}
              sortableFields={['name']}
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
};

const mapDispatchToProps = (dispatch, { form, name }) => ({
  addNew: () => dispatch(
    arrayPush(form, name, { id: uuid() })
  ),
});

export { Variables };

export default compose(
  connect(null, mapDispatchToProps),
)(Variables);
