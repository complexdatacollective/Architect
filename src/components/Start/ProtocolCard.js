import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProtocolCard = ({ path, name }) => (
  <Link
    component="div"
    className="start-protocol-card"
    to={`/edit/${encodeURIComponent(path)}`}
  >
    <div className="start-protocol-card__preview" />
    <div className="start-protocol-card__name">
      {name}
    </div>
  </Link>
);

ProtocolCard.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default ProtocolCard;
