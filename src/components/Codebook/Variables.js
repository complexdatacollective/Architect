import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { AutoSizer, Column, Table, SortDirection } from 'react-virtualized';
import { actionCreators as codebookActionCreators } from '@modules/protocol/codebook';
import { actionCreators as dialogActionCreators } from '@modules/dialogs';
import UsageColumn from './UsageColumn';
import ControlsColumn from './ControlsColumn';

const HEADER_HEIGHT = 25;
const ROW_HEIGHT = 50;

const Variables = ({ variables, handleDelete }) => {
  const contentHeight = (variables.length * ROW_HEIGHT) + HEADER_HEIGHT;
  const height = contentHeight > 500 ? 500 : contentHeight;

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <Table
          className="codebook__variables"
          headerClassName="codebook__variables-heading"
          width={width}
          height={height}
          headerHeight={HEADER_HEIGHT}
          rowHeight={ROW_HEIGHT}
          rowCount={variables.length}
          rowGetter={({ index }) => variables[index]}
          // sortBy="name"
          // sortDirection={SortDirection.ASC}
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
            className="codebook__variables-column"
            width={100}
            flexGrow={1}
            label="Usage"
            dataKey="usage"
            cellRenderer={UsageColumn}
          />
          <Column
            className="codebook__variables-column"
            width={200}
            dataKey="controls"
            label="Controls"
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

export { Variables };

export default compose(
  withVariableHandlers,
)(Variables);
