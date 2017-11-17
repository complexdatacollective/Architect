import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => (
  <div className="start">
    <Link className="start__protocol" to="/protocol">View protocol</Link>
  </div>
);

export { Start };
export default Start;
