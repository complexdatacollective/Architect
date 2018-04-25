/* eslint-disable */

import React from 'react';
import Tweened from '../../behaviours/Tweened';

const Panel = Tweened(({ children }) => (
  <div className="panel">
    { children }
  </div>
));

const Overview = ({ title }) => (
  <div className="timeline-overview">
    <Panel tweenName="protocol" tweenElement="overview-panel">
      { title }

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
    </Panel>
  </div>
);

export default Overview;
