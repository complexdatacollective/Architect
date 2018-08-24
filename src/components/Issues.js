import React from 'react';
import cx from 'classnames';
import { map, size } from 'lodash';

const Issues = ({ issues, show }) => (
  <div className={cx('issues', { 'issues--open': show && size(issues) > 0 })}>
    <div className="issues__panel">
      <div className="issues__title-bar">
        Issues ({size(issues)})
      </div>
      <ol className="issues__issues">
        { map(
          issues,
          (issue, name) =>
            <li key={name} className="issues__issue">{name} is {issue}</li>,
        ) }
      </ol>
    </div>
  </div>
);

export { Issues };

export default Issues;
