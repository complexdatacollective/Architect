import React from 'react';
import PropTypes from 'prop-types';
import AssetBadge from '../AssetBadge';

// TODO: add filter

const Panels = ({
  panels,
}) => {
  if (!panels || panels.length === 0) { return null; }

  return (
    <div className="protocol-summary-stage__panels">
      <h2>Panels</h2>
      {panels.map((panel) => (
        <div className="protocol-summary-stage__panels-panel" key={panel.id}>
          <h4>{panel.title}</h4>
          {
            panel.dataSource === 'existing'
              ? <p><em>Existing network</em></p>
              : <AssetBadge id={panel.dataSource} link />
          }
        </div>
      ))}
    </div>
  );
};

Panels.propTypes = {
  // panels: ,
};

Panels.defaultProps = {
  panels: null,
};

export default Panels;
