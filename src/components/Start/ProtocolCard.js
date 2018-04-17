import React from 'react';
import PropTypes from 'prop-types';

const ProtocolCard = ({ name, onClick }) => (
  <div
    className="start-protocol-card"
    onClick={onClick}
  >
    <div className="start-protocol-card__preview" />
    <div className="start-protocol-card__name">
      {name}
    </div>
  </div>
);

ProtocolCard.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProtocolCard;
