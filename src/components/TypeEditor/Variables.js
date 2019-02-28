import React from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import { orderBy } from 'lodash';
import VariablePreview from './VariablePreview';
import VariableFields from './VariableFields';
import EditableList from '../EditableList';

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

const filter = (list, { query, sortOrder }) =>
  sort(search(list, query), sortOrder);

const Variables = ({
  form,
  name,
  ...rest
}) => (
  <EditableList
    previewComponent={VariablePreview}
    editComponent={VariableFields}
    form={{ name: form }}
    fieldName={name}
    title="Edit Variable"
    filter={filter}
    sortMode="auto"
    {...rest}
  >
    <h2>Variables</h2>
  </EditableList>
);

Variables.propTypes = {
  form: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  sortableProperties: PropTypes.array.isRequired,
  initialSortOrder: PropTypes.object.isRequired,
};

export { Variables };

export default Variables;
