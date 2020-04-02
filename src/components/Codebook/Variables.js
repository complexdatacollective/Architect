import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers, withProps } from 'recompose';
import { get, tap, isString } from 'lodash';
import cx from 'classnames';
import { CellMeasurerCache, AutoSizer, Column, Table, SortDirection } from 'react-virtualized';
import { actionCreators as codebookActionCreators } from '@modules/protocol/codebook';
import { actionCreators as dialogActionCreators } from '@modules/dialogs';
import UsageColumn from './UsageColumn';
import ControlsColumn from './ControlsColumn';

const HEADER_HEIGHT = 50;
const DEFAULT_ROW_HEIGHT = 50;

const rowClassName = ({ index }) => {
  const isEven = index % 2 === 0;
  const isHeading = index === -1;
  return cx(
    'codebook__variables-row',
    {
      'codebook__variables-row--even': isEven && !isHeading,
      'codebook__variables-row--odd': !isEven && !isHeading,
      'codebook__variables-row--heading': isHeading,
    },
  );
};

const Variables = ({ variables, handleDelete, sortBy, sortDirection, sort }) => {
  // Set height to full content height (to prevent scrolling)
  // const height = (variables.length * DEFAULT_ROW_HEIGHT) + HEADER_HEIGHT;

  const cache = useMemo(() => new CellMeasurerCache({
    // defaultHeight: DEFAULT_ROW_HEIGHT,
    minHeight: DEFAULT_ROW_HEIGHT,
    fixedWidth: true,
  }), [variables]);

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <Table
          className="codebook__variables"
          headerClassName="codebook__variables-heading"
          rowClassName={rowClassName}
          width={width}
          height={10000}
          headerHeight={HEADER_HEIGHT}
          rowCount={variables.length}
          rowGetter={({ index }) => variables[index]}
          deferredMeasurementCache={cache}
          rowHeight={cache.rowHeight}
          sortBy={sortBy}
          sortDirection={sortDirection}
          sort={sort}
        >
          <Column
            className="codebook__variables-column"
            label="Name"
            dataKey="name"
            flexGrow={1}
            width={200}
          />
          <Column
            className="codebook__variables-column"
            label="Type"
            dataKey="type"
            flexGrow={1}
            width={200}
          />
          <Column
            className="codebook__variables-column"
            label="Component"
            dataKey="component"
            flexGrow={1}
            width={200}
          />
          <Column
            className="codebook__variables-column codebook__variables-column--usage"
            width={100}
            flexGrow={1}
            label="Used in"
            dataKey="inUse"
            cache={cache}
            cellRenderer={UsageColumn(cache)}
          />
          <Column
            className="codebook__variables-column"
            width={200}
            dataKey="controls"
            label=""
            columnData={{ handleDelete }}
            cellRenderer={ControlsColumn}
          />
        </Table>
      )}
    </AutoSizer>
  );
};

Variables.propTypes = {
  variables: PropTypes.array,
  handleDelete: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]).isRequired,
  sort: PropTypes.func.isRequired,
};

Variables.defaultProps = {
  variables: [],
  handleDelete: () => {},
};

const withVariableHandlers = compose(
  connect(null, {
    openDialog: dialogActionCreators.openDialog,
    deleteVariable: codebookActionCreators.deleteVariable,
  }),
  withHandlers({
    handleDelete: ({ deleteVariable, openDialog, entity, type }) =>
      (id, name) => {
        openDialog({
          type: 'Warning',
          title: `Delete ${name}`,
          message: (
            <p>
              Are you sure you want to delete the variable called {name}? This cannot be undone.
            </p>
          ),
          onConfirm: () => { deleteVariable(entity, type, id); },
          confirmLabel: `Delete ${name}`,
        });
      },
  }),
);

const uppercaseString = prop =>
  (isString(prop) ? prop.toUpperCase() : prop);

const sortByProp = sortBy =>
  (a, b) => {
    const sortPropA = tap(get(a, sortBy, ''), uppercaseString);
    const sortPropB = tap(get(b, sortBy, ''), uppercaseString);
    if (sortPropA < sortPropB) { return -1; }
    if (sortPropA > sortPropB) { return 1; }
    return 0;
  };

const withSort = compose(
  withStateHandlers(
    {
      sortBy: 'name',
      sortDirection: SortDirection.ASC,
    },
    {
      sort: () =>
        ({ sortBy, sortDirection }) => ({
          sortBy,
          sortDirection,
        }),
    },
  ),
  withProps(
    ({ sortBy, sortDirection, variables }) => ({
      variables: tap(
        variables.sort(sortByProp(sortBy)),
        list => (sortDirection === SortDirection.DESC ? list.reverse() : list),
      ),
    }),
  ),
);

export { Variables };

export default compose(
  withVariableHandlers,
  withSort,
)(Variables);
