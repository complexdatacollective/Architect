/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Fuse from 'fuse.js';
import { orderBy } from 'lodash';
import Variable from './Variable';
import { FieldArrayAdapter as UnorderedList, NewButton } from '../UnorderedList';

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 10,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'name',
    'label',
    'description',
  ],
};

const search = (list, query) => {
  if (!query) { return list; }
  const fuse = new Fuse(list, fuseOptions);
  const result = fuse.search(query);
  return result;
};

const sort = (list, sortOrder) => {
  if (!sortOrder) { return list; }
  return orderBy(list, sortOrder.property, sortOrder.direction);
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
              component={UnorderedList}
              item={Variable}
              name={name}
              form={form}
              filter={filter}
              sortableProperties={['name', 'type']}
              initialSortOrder={{
                direction: 'asc',
                property: 'name',
              }}
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
