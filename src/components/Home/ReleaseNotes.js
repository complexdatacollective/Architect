import React from 'react';
import PropTypes from 'prop-types';
import Section from './Section';
import Group from './Group';

const ReleaseNotes = ({ version, notes }) => (
  <Section>
    <Group color="cerulean-blue" className="release-notes" icon="info">
      <h2>Whats new in {version}</h2>
      {notes}
    </Group>
  </Section>
);

ReleaseNotes.propTypes = {
  version: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
};

export default ReleaseNotes;
