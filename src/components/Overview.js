import path from 'path';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { map, get, size } from 'lodash';
import { compose } from 'recompose';
import { Node, Icon, GraphicButton } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getActiveProtocolMeta } from '@selectors/protocols';
import { getProtocol } from '../selectors/protocol';
import Link from './Link';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';
import { actionCreators as uiActions } from '../ducks/modules/ui';

const panelVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', staggerChildren: 0.5 } },
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
      openScreen,
      show,
    } = this.props;

    if (!show) { return null; }

    return (
      <React.Fragment>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="protocol-name">
          <h1 className="overview__name">{name}</h1>
        </motion.div>
        <motion.div
          className="overview"
          variants={panelVariants}
          initial="initial"
          animate="animate"
        >
          <div className="overview__panel">
            <div className="overview__groups">
              <div className="overview__group overview__group--title">
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
                <GraphicButton
                  // graphic={createButtonGraphic}
                  graphicPosition="20% bottom"
                  graphicSize="auto 90%"
                  onClick={() => openScreen('assets')}
                >
                  <h3>Manage Protocol</h3>
                  <h2>Assets</h2>
                </GraphicButton>
                <GraphicButton
                  // graphic={createButtonGraphic}
                  color="neon-coral"
                  graphicPosition="20% bottom"
                  graphicSize="auto 90%"
                  onClick={() => openScreen('codebook')}
                >
                  <h3>Manage</h3>
                  <h2>Codebook</h2>
                </GraphicButton>
              </div>
            </div>
          </div>
        </motion.div>
      </React.Fragment>
    );
  }
}

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  codebook: PropTypes.object.isRequired,
  updateOptions: PropTypes.func,
  openScreen: PropTypes.func.isRequired,
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
