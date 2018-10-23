import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { nth, find, get } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import Scene from './components/Scene';
import ProtocolLoader from './components/ProtocolLoader';
import Preview from './components/Preview';
import tween from './behaviours/Tweened/tween';

const getProtocolPath = pathname =>
  decodeURIComponent(nth(/^\/edit\/([^/]+)$/.exec(pathname), 1));

const getProtocolId = (protocols, path) => {
  const idFromArchivePath = get(find(protocols, ['archivePath', path]), 'id');
  const idFromWorkingPath = get(find(protocols, ['workingPath', path]), 'id');
  return idFromArchivePath || idFromWorkingPath || null;
};

const getProtocolIdFromPathname = (protocols, pathname) =>
  getProtocolId(protocols, getProtocolPath(pathname));

const dispatchRouteAnimations = ({ pathname }, entries, protocols) => {
  if (entries.length < 2) { return; }

  const { pathname: previousPathname } = nth(entries, -2);

  switch (true) {
    case /^\/edit\/[^/]+$/.test(previousPathname) && /^\/$/.test(pathname): {
      tween({ name: 'protocol', from: 'overview-panel', to: getProtocolIdFromPathname(protocols, previousPathname) });
      break;
    }
    case /^\/$/.test(previousPathname) && /^\/edit\/[^/]+$/.test(pathname): {
      tween({ name: 'protocol', from: getProtocolIdFromPathname(protocols, pathname), to: 'overview-panel' });
      break;
    }
    default:
  }
};

class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [props.history.location],
    };
  }

  componentDidMount() {
    this.props.history.listen(
      (event) => {
        const entries = [
          ...this.state.entries,
          event,
        ];

        this.setState(
          { entries },
          () => dispatchRouteAnimations(event, entries, this.props.protocols),
        );
      },
    );
  }

  render() {
    const { location, history } = this.props;
    return (
      <Switch>
        <Route
          path="/preview/:protocol/:stageIndex"
        >
          { props => (
            <React.Fragment>
              <ProtocolLoader {...props} />
              <Preview {...props} stageIndex={props.match.params.stageIndex} />
            </React.Fragment>
          ) }
        </Route>
        <Route>
          <React.Fragment>
            <Route
              path="/edit/:protocol"
            >
              { props => <ProtocolLoader {...props} /> }
            </Route>
            <Scene history={history} location={location} />
          </React.Fragment>
        </Route>
      </Switch>
    );
  }
}

Routes.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  protocols: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  protocols: state.protocols,
});

export { Routes };

export default connect(
  mapStateToProps,
)(
  Routes,
);
