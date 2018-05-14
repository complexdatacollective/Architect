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

const ProtocolCard = ({ protocol: { id, archivePath } }) => (
  <Link
    component="div"
    className="start-protocol-card"
    to={`/edit/${encodeURIComponent(id)}`}
  >
    <div className="start-protocol-card__preview">
      <Stack
        tweenName="protocol"
        tweenElement={id}
      />
    </div>
    <div className="start-protocol-card__label">
      <h3 className="start-protocol-card__name">{ archivePath }</h3>
    </div>
  </Link>
);

ProtocolCard.propTypes = {
  protocol: PropTypes.object.isRequired,
};

export default ProtocolCard;
