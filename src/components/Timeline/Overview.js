import React from 'react';
import Tweened from '../../behaviours/Tweened';

const Panel = Tweened(() => (
  <div className="panel">
    Hello wosoeidnfpgfp.foog
    fpg<br />
    Hello wosoeidnfpgfp.foog
    fpg<br />
    Hello wosoeidnfpgfp.foog
    fpg<br />Hello wosoeidnfpgfp.foog
    fpg<br />
  </div>
));

const TimelineOverview = () => (
  <div className="timeline-overview">
    <Panel tweenName="protocol" tweenElement="overview-panel" />
  </div>
);

export default TimelineOverview;
