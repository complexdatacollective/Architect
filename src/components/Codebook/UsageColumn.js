import React from 'react';
import PropTypes from 'prop-types';
import ScreenLink from '@components/Screens/ScreenLink';
import Tag from './Tag';

const UsageColumn = ({
  inUse,
  usage,
}) => {
  if (!inUse) { return (<Tag key="unused">not in use</Tag>); }

  const stages = usage
    .map(({ id, label }) => (
      <ScreenLink screen="stage" id={id} key={id}>{label}</ScreenLink>
    ));

  return (
    <div className="codebook__variables-usage-container" key="usage">
      {stages}
    </div>
  );
};

UsageColumn.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  usage: PropTypes.array.isRequired,
  inUse: PropTypes.bool.isRequired,
};

export default UsageColumn;
