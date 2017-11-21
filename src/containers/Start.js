import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import exporter from '../utils/exporter';

class Start extends PureComponent {
  export = () => {
    exporter();
  }

  render() {
    return (
      <div className="start">
        <Link className="start__protocol" to="/protocol">View protocol</Link>
        <button onClick={() => this.export()}>Export</button>
      </div>
    );
  }
}

export { Start };
export default Start;
