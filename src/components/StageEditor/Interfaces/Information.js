import React from 'react';
import {
  Title,
  ContentItems,
} from '../sections';

const Information = {
  guidance: (
    <React.Fragment>
      <h3>Information screen guidance</h3>
      <p>
        The Information Interface allows you to display text and rich media (including pictures,
        video and audio) to your participants. Use it to help explain interview tasks, or introduce
        concepts or ideas.
      </p>
    </React.Fragment>
  ),
  sections: [
    Title,
    ContentItems,
  ],
};

export default Information;
