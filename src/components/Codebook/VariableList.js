import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Heading, withSort, rowClassName } from './Variables';

const SortDirection = {
  ASC: Symbol('ASC'),
  DESC: Symbol('DESC'),
};

const Variables = ({ variables, sortBy, sortDirection, sort }) => {
  const headingProps = {
    sortBy,
    sortDirection,
    onSort: sort,
  };

  return (
    <div>
      <table className="codebook__variables">
        <thead>
          <tr className="codebook__variables-row codebook__variables-row--heading">
            <Heading name="name" {...headingProps}>Name</Heading>
            {/* <Heading name="type" {...headingProps}>Type</Heading> */}
            <th />
          </tr>
        </thead>
        <tbody>
          {variables.map(({ id, name }, index) => (
            <tr className={rowClassName(index)} key={id}>
              <td className="codebook__variables-column">{name}</td>
              {/* <td className="codebook__variables-column">{type}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Variables.propTypes = {
  variables: PropTypes.array,
  onDelete: PropTypes.func,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]).isRequired,
  sort: PropTypes.func.isRequired,
};

Variables.defaultProps = {
  variables: [],
  onDelete: () => {},
};

export { Variables };

export default compose(
  withSort,
)(Variables);
