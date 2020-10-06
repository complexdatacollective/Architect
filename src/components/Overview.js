import path from 'path';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { map, get, size } from 'lodash';
import { compose } from 'recompose';
import { Node, Icon, Button } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getProtocol } from '../selectors/protocol';
import Link from './Link';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';
import { actionCreators as uiActions } from '../ducks/modules/ui';

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

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
    } = this.props;

    if (!show) { return null; }

    return (
      <motion.div
        className="overview"
        variants={variants}
        initial="initial"
        animate="animate"
      >
        <div className="overview__panel">
          <div className="overview__groups">
            <div className="overview__group overview__group--title">
              <h1 className="overview__name">{name}</h1>
              <Fields.TextArea
                className="overview__description"
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
            <div className="overview__group--buttons">
              <Link screen="assets"><Button>Manage assets</Button></Link>
              <div style={{ padding: '0 0 0 1rem', display: 'inline-block' }}>
                <Link screen="codebook"><Button color="neon-coral">Manage codebook</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
}

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  codebook: PropTypes.object.isRequired,
  updateOptions: PropTypes.func,
  show: PropTypes.bool,
};

Overview.defaultProps = {
  show: true,
  name: null,
  description: '',
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
