import path from 'path';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { map, get, size } from 'lodash';
import { compose } from 'recompose';
import { Node, Icon, Button } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getProtocol, getActiveProtocolMeta } from '../selectors/protocol';
import Link from './Link';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';
import { actionCreators as uiActions } from '../ducks/modules/ui';

class Overview extends Component {
  renderNodeTypes() {
    const nodeTypes = get(this.props.codebook, 'node', {});
    if (size(nodeTypes) === 0) {
      return (
        <em>No node types defined, yet. <Link screen="type" params={{ category: 'node' }}>Create one?</Link></em>
      );
    }

    return map(
      nodeTypes,
      (node, type) => (
        <Link
          screen="type"
          params={{ category: 'node', type }}
          key={type}
        >
          <Node label={node.label} color={get(node, 'color', '')} />
        </Link>
      ),
    );
  }

  renderEdgeTypes() {
    const edgeTypes = get(this.props.codebook, 'edge', {});

    if (size(edgeTypes) === 0) {
      return (
        <em>No edge types defined, yet. <Link screen="type" params={{ category: 'edge' }}>Create one?</Link></em>
      );
    }

    return map(
      edgeTypes,
      (edge, type) => (
        <Link
          screen="type"
          params={{ category: 'edge', type }}
          key={type}
        >
          <Icon name="links" color={get(edge, 'color', '')} />
        </Link>
      ),
    );
  }

  render() {
    const {
      name,
      description,
      updateOptions,
      show,
      flipId,
    } = this.props;

    if (!show || !flipId) { return null; }

    return (
      <React.Fragment>
        <Flipped flipId={flipId}>
          <div className="overview">
            <div className="overview__panel">
              <div className="overview__groups">
                <div className="overview__group overview__group--title">
                  <h1 className="overview__name">{name}</h1>
                  <Fields.Text
                    className="timeline-overview__name"
                    placeholder="Enter a description for your protocol here"
                    label="Protocol description"
                    input={{
                      value: description,
                      onChange:
                        ({ target: { value } }) => {
                          updateOptions({ description: value });
                        },
                    }}
                  />
                </div>
                <div style={{ padding: '1rem 0 0', width: '100%', textAlign: 'right' }}>
                  <Link screen="assets"><Button size="small">Manage assets</Button></Link>
                  <div style={{ padding: '0 0 0 1rem', display: 'inline-block' }}>
                    <Link screen="codebook"><Button size="small" color="neon-coral">Manage codebook</Button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Flipped>
      </React.Fragment>
    );
  }
}

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  codebook: PropTypes.object.isRequired,
  updateOptions: PropTypes.func,
  flipId: PropTypes.string,
  show: PropTypes.bool,
};

Overview.defaultProps = {
  show: true,
  name: null,
  description: '',
  flipId: null,
  updateOptions: () => {},
};

const mapDispatchToProps = {
  updateOptions: protocolActions.updateOptions,
  openScreen: uiActions.openScreen,
};

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);
  const meta = getActiveProtocolMeta(state);
  const filePath = meta && meta.filePath && path.basename(meta.filePath);

  return {
    name: filePath,
    description: protocol && protocol.description,
    codebook: protocol && protocol.codebook,
  };
};

export { Overview };

export default compose(connect(mapStateToProps, mapDispatchToProps))(Overview);
