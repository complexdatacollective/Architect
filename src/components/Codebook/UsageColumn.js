import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actionCreators as screenActions } from '@modules/ui/screens';
import ScreenLink from '@components/Screens/Link';
import Tag from './Tag';

const UsageColumn = ({
  inUse,
  usage,
  closeScreen,
}) => {
  const closeCodebook = useCallback(() => {
    closeScreen('codebook');
  }, ['closeScreen']);

  const stages = usage
    .sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      // a must be equal to b
      return 0;
    })
    .map(({ id, label }) => (
      <ScreenLink screen="stage" id={id} onClick={closeCodebook}>{label}</ScreenLink>
    ));

  return [
    inUse && <div className="codebook__variables-usage-container">{stages}</div>,
    !inUse && <Tag>not in use</Tag>,
  ];
};

UsageColumn.propTypes = {
  usage: PropTypes.array.isRequired,
  inUse: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  closeScreen: screenActions.closeScreen,
};

export { UsageColumn };

export default connect(null, mapDispatchToProps)(UsageColumn);
