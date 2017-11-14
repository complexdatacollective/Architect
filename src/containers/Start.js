import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => (
  <div className="start">
    Welcome.

    <Link to="/protocol">Protocol</Link>
  </div>
);

export { Start };
export default Start;
