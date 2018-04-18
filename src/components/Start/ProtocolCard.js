import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import protocolCover from '../../images/protocol-cover.png';

const ProtocolCard = ({ path, name }) => (
  <Link
    component="div"
    className="start-protocol-card"
    to={`/edit/${encodeURIComponent(path)}`}
  >
    <div className="start-protocol-card__preview">
      <div className="start-protocol-card__preview-cover">
        <img src={protocolCover} alt="" />
      </div>
    </div>
    <h3 className="start-protocol-card__name">{name}</h3>
    <div className="start-protocol-card__path">{path}</div>
  </Link>
);

ProtocolCard.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default ProtocolCard;
