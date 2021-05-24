import React from 'react';
import EntityBadge from '../EntityBadge';
import Filter from './Filter';
import MiniTable from '../MiniTable';

const Subject = ({ subject, filter }) => {
  if (!subject) { return null; }

  return (
    <div className="protocol-summary-stage__subject">
      <h2>Subject</h2>
      <div className="protocol-summary-stage__subject-content">
        <EntityBadge type={subject.type} entity={subject.entity} link />
        { filter && (
          <MiniTable
            rows={[
              ['Filter'],
              [<Filter filter={filter} />],
            ]}
            wide
          />
        )}
      </div>
    </div>
  );
};

export default Subject;
