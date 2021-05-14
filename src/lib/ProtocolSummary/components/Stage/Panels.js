import React from 'react';
import PropTypes from 'prop-types';
import MiniTable from '../MiniTable';
import Asset from '../Asset';

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
              ? <p>Existing network</p>
              : <Asset id={panel.dataSource} />
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
