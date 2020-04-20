import React from 'react';
import PropTypes from 'prop-types';
import ScreenLink from '@components/Screens/Link';
import Tag from './Tag';

const UsageColumn = ({
  inUse,
  usage,
}) => {
  const stages = usage
    .map(({ id, label }) => (
      <ScreenLink screen="stage" id={id}>{label}</ScreenLink>
    ));

  return [
    inUse && <div>{stages}</div>,
    !inUse && <Tag>not in use</Tag>,
  ];
};

UsageColumn.propTypes = {
  usage: PropTypes.array.isRequired,
  inUse: PropTypes.bool.isRequired,
};

export default UsageColumn;
