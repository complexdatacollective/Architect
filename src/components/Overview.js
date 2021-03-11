import path from 'path';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { map, get, size } from 'lodash';
import { compose } from 'recompose';
import { Node, Icon, Button } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getActiveProtocol } from '@selectors/session';
import { getProtocol } from '../selectors/protocol';
import Link from './Link';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';
import { actionCreators as uiActions } from '../ducks/modules/ui';

const panelVariants = {
  hide: { opacity: 0, y: -200 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, when: 'beforeChildren' } },
};

class Overview extends Component {
  renderNodeTypes() {
    const nodeTypes = get(this.props.codebook, 'node', {});
    if (size(nodeTypes) === 0) {
      return (
        <em>
          No node types defined, yet.
          <Link screen="type" params={{ category: 'node' }}>Create one?</Link>
        </em>
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
        <em>
          No edge types defined, yet.
          <Link screen="type" params={{ category: 'edge' }}>Create one?</Link>
        </em>
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
      openScreen,
    } = this.props;

    return (
      <motion.div
        className="overview"
        variants={panelVariants}
      >
        <div className="overview__panel">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="protocol-name">
            <h1 className="overview-name">{name}</h1>
          </motion.div>
          <div className="overview-description">
            <Fields.TextArea
              className="overview-description__field"
              placeholder="Enter a description for your protocol..."
              input={{
                value: description,
                onChange:
                  ({ target: { value } }) => {
                    updateOptions({ description: value });
                  },
              }}
            />
          </div>
        </div>
        <div className="overview__footer">
          <Icon name="protocol-card" />
          <Button onClick={() => openScreen('assets')} color="neon-coral">Resource Library</Button>
          <Button onClick={() => openScreen('codebook')} color="sea-serpent">Manage Codebook</Button>
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
  openScreen: PropTypes.func.isRequired,
};

Overview.defaultProps = {
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
  const filePath = getActiveProtocol(state);
  const fileName = filePath && path.basename(filePath);

  return {
    name: fileName,
    description: protocol && protocol.description,
    codebook: protocol && protocol.codebook,
  };
};

export { Overview };

export default compose(connect(mapStateToProps, mapDispatchToProps))(Overview);
