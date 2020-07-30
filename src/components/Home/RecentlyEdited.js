import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { appVersion } from '@app/utils/appVersion';
import Section from './Section';
import Group from './Group';

const getRecentProtocols = state =>
  get(state, 'recentProtocols', [])
    .slice(0, 10);

const RecentlyEdited = ({ recentProtocols }) => {
  return (
    recentProtocols.length > 0 &&
    <Section key="recently-edited">
      <Group color="cerulean-blue" className="release-notes" icon="info">
        <h2>Recently Edited</h2>

      </Group>
    </Section>
  );
};

RecentlyEdited.propTypes = {
  recentProtocols: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  recentProtocols: getRecentProtocols(state),
});

const withState = connect(mapStateToProps);

export default withState(RecentlyEdited);
