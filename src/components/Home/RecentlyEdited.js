import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Section from './Section';
import Group from './Group';
import ProtocolCard from './ProtocolCard';

const getRecentProtocols = state =>
  get(state, 'recentProtocols', [])
    .slice(0, 9);

const RecentlyEdited = ({ recentProtocols }) => (
  recentProtocols.length > 0 &&
  <Section key="recently-edited" className="recently-edited">
    <Group>
      <h2>Recently Edited</h2>
      <div className="recently-edited__protocols">
        {recentProtocols.map(ProtocolCard)}
      </div>
    </Group>
  </Section>
);

RecentlyEdited.propTypes = {
  recentProtocols: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  recentProtocols: getRecentProtocols(state),
});

const withState = connect(mapStateToProps);

export default withState(RecentlyEdited);
