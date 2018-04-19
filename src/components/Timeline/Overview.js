import React from 'react';
import TweenTo from '../../behaviours/Tween/To';

const Panel = TweenTo(() => (
  <div className="panel">
    <br />
    <br />
    <br />
  </div>
));

const TimelineOverview = () => (
  <div className="timeline-overview">
    <Panel name="foo" />
  </div>
);

export default TimelineOverview;
