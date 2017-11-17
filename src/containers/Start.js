import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import exporter from '../utils/exporter';

class Start extends PureComponent {
  constructor(props) {
    super(props);

    exporter();
  }

  render() {
    return (
      <div className="start">
        <Link className="start__protocol" to="/protocol">View protocol</Link>
      </div>
    );
  }
}

export { Start };
export default Start;
