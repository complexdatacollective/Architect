import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// () => handleLoadProtocol(filePath)

const ProtocolCard = ({
  description,
  lastModified,
  name,
  onClick,
  schemaVersion,
  disabled,
}) => {
  const className = cx(
    'protocol-card',
    { 'protocol-card--disabled': disabled },
  );

  return (
    <div className={className} onClick={onClick}>
      <div className="protocol-card__icon-section">
        <div className="protocol-icon" />
        <div className="protocol-meta">
          <h6>Last Modified: {lastModified} {/* 26 June 2020, 10:28 */}</h6>
          <h6>Schema Version: {schemaVersion}</h6>
        </div>
      </div>
      <div className="protocol-card__main-section">
        <h2 className="protocol-name">{name}</h2>
        <div className="scrollable protocol-description">{description}</div>
      </div>
    </div>
  );
};

ProtocolCard.propTypes = {
  description: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  lastModified: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  schemaVersion: PropTypes.string.isRequired,
};

ProtocolCard.defaultProps = {};

export default ProtocolCard;
