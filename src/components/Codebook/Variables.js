import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Table } from 'react-virtualized';

const Variables = ({ variables }) => (
  <Table
    width={300}
    height={300}
    headerHeight={20}
    rowHeight={30}
    rowCount={variables.length}
    rowGetter={({ index }) => variables[index]}
  >
    <Column
      label="Name"
      dataKey="name"
      width={100}
    />
    <Column
      width={200}
      label="Is Used"
      dataKey="isUsed"
    />
  </Table>
);

Variables.propTypes = {
  variables: PropTypes.array,
  handleDelete: PropTypes.func.isRequired,
};

Variables.defaultProps = {
  variables: [],
  handleDelete: () => {},
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
};

export { Variables };

export default connect(mapStateToProps, mapDispatchToProps)(Variables);
