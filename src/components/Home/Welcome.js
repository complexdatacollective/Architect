
import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';

const Welcome = () => (
  <Section>
    <div className="home-welcome__header">
      <h1>Welcome</h1>
      <h3>Some info about the project goes here</h3>
      <p>Welcome to Network Canvas Architect! To get started, use the buttons above to
        create a new interview protocol, or open an existing one from elsewhere. When you
        return to this screen later, recent protocols you have opened will be shown here.</p>
      <div className="aspect-ratio">
        <img src="https://placehold.it/160x80" alt="foo" />
      </div>

      <label htmlFor="showOnStartup" className="home-section__toggle-panel">
        <input type="checkbox" id="showOnStartup" checked="checked" /> Show on startup
      </label>
    </div>
    <div className="home-section__sub">
      <h1>Further reading</h1>
      <ul>
        <li>Read through <a href="">the tutorials</a></li>
        <li>Find out more in <a href="">the documentation</a></li>
        <li>See what has changed in <a href="">the release notes</a></li>
      </ul>
    </div>
  </Section>
);

export default Welcome;
