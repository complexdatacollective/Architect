import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { create } from '../other/protocols';

class Start extends PureComponent {
  render() {
    return (
      <div className="start">
        <Link className="start__protocol" to="/protocol">View protocol</Link>
        <button onClick={() => this.export()}>Export</button>
        <button onClick={() => create()}>Create new Protocol</button>
      </div>
    );
  }
}

export { Start };
export default Start;
