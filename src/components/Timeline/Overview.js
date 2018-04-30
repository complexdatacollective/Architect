/* eslint-disable */

import React from 'react';
import Tweened from '../../behaviours/Tweened';

const Panel = Tweened(({ children }) => (
  <div className="timeline-overview">
    { children }
  </div>
));

const Overview = ({ title }) => (
  <Panel tweenName="protocol" tweenElement="overview-panel">
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
  </Panel>
);

export default Overview;
