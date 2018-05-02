import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Tweened from '../../behaviours/Tweened';
import protocolCover from '../../images/protocol-cover.png';

const Stack = Tweened(() => (
  <div className="start-protocol-card__stack">
    <div className="start-protocol-card__stack-cover">
      <img src={protocolCover} alt="" />
    </div>
  </div>
));

const ProtocolCard = ({ path, name }) => (
  <Link
    component="div"
    className="start-protocol-card"
    to={`/edit/${encodeURIComponent(path)}`}
  >
    <div className="start-protocol-card__preview">
      <Stack
        tweenName="protocol"
        tweenElement={path}
      />
    </div>
    <div className="start-protocol-card__label">
      <h3 className="start-protocol-card__name">{name}</h3>
    </div>
  </Link>
);

ProtocolCard.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default ProtocolCard;
