import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import { AutoSizer, Column, Table, SortDirection } from 'react-virtualized';
import { actionCreators as codebookActionCreators } from '@modules/protocol/codebook';
import { actionCreators as dialogActionCreators } from '@modules/dialogs';
import UsageColumn from './UsageColumn';
import ControlsColumn from './ControlsColumn';

const Variables = ({ variables, handleDelete }) => (
  <AutoSizer disableHeight>
    {({ width }) => (
      <Table
        width={width}
        height={500}
        headerHeight={20}
        rowHeight={30}
        rowCount={variables.length}
        rowGetter={({ index }) => variables[index]}
        // sortBy="name"
        // sortDirection={SortDirection.ASC}
      >
        <Column
          label="Name"
          dataKey="name"
          flexGrow={1}
          width={200}
        />
        <Column
          label="Type"
          dataKey="type"
          flexGrow={1}
          width={200}
        />
        <Column
          label="Component"
          dataKey="component"
          flexGrow={1}
          width={200}
        />
        <Column
          width={100}
          flexGrow={1}
          label="Usage"
          dataKey="usage"
          cellRenderer={UsageColumn}
        />
        <Column
          width={100}
          dataKey="controls"
          label="Controls"
          columnData={{ handleDelete }}
          cellRenderer={ControlsColumn}
        />
      </Table>
    )}
  </AutoSizer>
);

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
