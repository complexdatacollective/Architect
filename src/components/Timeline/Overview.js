import React from 'react';
import TweenTo from '../../behaviours/Tween/To';

const Panel = TweenTo(() => (
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
    <Panel name="foo" />
  </div>
);

export default TimelineOverview;
