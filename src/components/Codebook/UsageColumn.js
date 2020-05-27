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

  if (!inUse) { return (<Tag key="unused">not in use</Tag>); }

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
      <ScreenLink screen="stage" id={id} onClick={closeCodebook} key={id}>{label}</ScreenLink>
    ));

  return (
    <div className="codebook__variables-usage-container" key="usage">
      {stages}
    </div>
  );
};

UsageColumn.propTypes = {
  usage: PropTypes.array.isRequired,
  inUse: PropTypes.bool.isRequired,
  closeScreen: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  closeScreen: screenActions.closeScreen,
};

export { UsageColumn };

export default connect(null, mapDispatchToProps)(UsageColumn);
