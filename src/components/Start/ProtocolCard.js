/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProtocolCard = ({ protocol }) => (
  <Link
    component="div"
    className="start-protocol-card"
    to={`/edit/${encodeURIComponent(protocol.path)}`}
  >
    <div className="start-protocol-card__preview" />
    <div className="start-protocol-card__name">
      {name}
    </div>
  </Link>
);

ProtocolCard.propTypes = {
  // name: PropTypes.string.isRequired,
  // onClick: PropTypes.func.isRequired,
};

export default ProtocolCard;
