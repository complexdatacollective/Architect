import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  Heading,
  withSort,
  rowClassName,
  SortDirection,
} from './Variables';

const Variables = ({
  variables, sortBy, sortDirection, sort,
}) => {
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
            <Heading
              name="name"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...headingProps}
            >
              Name
            </Heading>
          </tr>
        </thead>
        <tbody>
          {variables.map((name, index) => (
            <tr className={rowClassName(index)} key={name}>
              <td className="codebook__variables-column">{name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Variables.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
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
