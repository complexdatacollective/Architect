import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../../../ui/components';

const Type = ({ label, link, children, usage, handleDelete }) => (
  <div className="simple-list__item">
    <div className="simple-list__attribute simple-list__attribute--icon">
      <Link to={link}>
        {children}
      </Link>
    </div>
    <div className="simple-list__attribute">
      <h3>
        <Link to={link}>
          {label}
        </Link>
      </h3>
      { usage.length === 0 && <div className="simple-list__tag">unused</div> }
    </div>
    <div className="simple-list__attribute simple-list__attribute--options">
      <Button size="small" color="neon-coral" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  </div>
);

Type.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  usage: PropTypes.array,
  handleDelete: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Type.defaultProps = {
  usage: [],
};

export default Type;
