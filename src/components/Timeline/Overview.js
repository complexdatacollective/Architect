/* eslint-disable */

import React from 'react';
import { Tweened } from '../../behaviours/Tweened';

const Overview = ({ title }) => (
  <div className="timeline-overview">
    <div className="timeline-overview__panel">
      <div className="timeline-overview__content">
        <h2 className="timeline-overview__title">{ title }</h2>

        <div className="panel__groups">
          <div className="panel__group">
            <h3 className="panel__group-title">Variable registry</h3>
          </div>
          <div className="panel__group">
            <h3 className="panel__group-title">Forms</h3>
          </div>
          <div className="panel__group">
            <h3 className="panel__group-title">Global Options</h3>
          </div>
          <div className="panel__group">
            <h3 className="panel__group-title">Assets</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Tweened({
  tweenName: 'protocol',
  tweenElement: 'overview-panel',
})(Overview);
