import React, { Component } from 'react';
import fs from 'fs';
import path from 'path';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get, keys } from 'lodash';
import { map, groupBy, toPairs } from 'lodash/fp';
import { compose } from 'recompose';
import { Image } from '../Assets';
import { Contexts, SeamlessText } from '../Form/Fields';
import { Tweened } from '../../behaviours/Tweened';
import { actionCreators as protocolActions } from '../../ducks/modules/protocol';

const PanelGroup = ({ title, children }) => (
  <div className="timeline-overview__group">
    <h3 className="timeline-overview__group-title">{title}</h3>
    { !children && <p>No {title} options.</p> }
    { children }
  </div>
);

const sortAssets = compose(
  toPairs,
  groupBy('extension'),
  map(
    assetPath => ({ assetPath, extension: path.extname(assetPath) })
  ),
);

class Overview extends Component {
  get renderAssets() {
    const assets = this.props.assets;

    console.log(sortAssets(assets));

    return sortAssets(assets)
      .map(([groupName, group]) => {
        if (!['.png', '.jpg', '.gif'].includes(groupName)) {
          return <div className="timeline-overview__badge"><em>{groupName}</em> x {group.length}</div>;
        }

        return (
          <div className="timeline-overview__asset-group">
            {group.map(
              ({ assetPath }) =>
                <Image url={assetPath} className="timeline-overview__asset" />,
            )}
          </div>
        );
      });
  }

  render() {
    const {
      name,
      version,
      variableRegistry,
      updateOptions,
    } = this.props;

    const nodeTypes = keys(get(variableRegistry, 'node', {}));
    const edgeTypes = keys(get(variableRegistry, 'edge', {}));

    return (
      <div className="timeline-overview">
        <form>
          <div className="timeline-overview__panel">
            <div className="timeline-overview__content">
              <SeamlessText
                className="timeline-overview__name"
                input={{
                  value: name,
                  onChange: ({ target: { value } }) => { updateOptions({ name: value }); },
                }}
              />

              <div className="timeline-overview__groups">

                <PanelGroup title="Variable registry">
                  <br />
                  <h4>Node types</h4>
                  <Contexts options={nodeTypes} input={{ value: null, onChange: () => {} }} />
                  <br />
                  <h4>Edge types</h4>
                  <Contexts options={edgeTypes} input={{ value: null, onChange: () => {} }} />
                </PanelGroup>
                <PanelGroup title="Forms" />
                <PanelGroup title="Global Options">
                  <p>Version: {version}</p>
                </PanelGroup>
                <PanelGroup title="Assets">
                  {this.renderAssets}
                </PanelGroup>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

Overview.propTypes = {
  name: PropTypes.string,
  version: PropTypes.string,
  forms: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  variableRegistry: PropTypes.object,
  externalData: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  updateOptions: PropTypes.func,
  assets: PropTypes.array,
};

Overview.defaultProps = {
  name: '',
  version: '',
  forms: {},
  variableRegistry: {},
  externalData: {},
  updateOptions: () => {},
  assets: [],
};

const mapStateToProps = (state) => {
  const workingPath = get(state, 'session.activeProtocol.workingPath');

  return {
    assets: workingPath ? fs.readdirSync(path.join(workingPath, 'assets')) : [],
  };
};

const mapDispatchToProps = dispatch => ({
  updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  Tweened({
    tweenName: 'protocol',
    tweenElement: 'overview-panel',
  }),
)(Overview);
