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
import codebookGraphic from '@app/images/undraw_science.svg';
import assetsGraphic from '@app/images/undraw_media.svg';
import { getProtocol } from '../selectors/protocol';
import Link from './Link';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';
import { actionCreators as uiActions } from '../ducks/modules/ui';

const panelVariants = {
  hide: { opacity: 0, y: -200 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, when: 'beforeChildren' } },
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
    } = this.props;

    return (
      <React.Fragment>
        <motion.div
          className="overview"
          variants={panelVariants}
        >

          <div className="overview__panel">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="protocol-name">
              <h1 className="overview__name">{name}</h1>
            </motion.div>
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
                  graphic={assetsGraphic}
                  color="sea-serpent"
                  graphicPosition="90% center"
                  graphicSize="auto 90%"
                  labelPosition={{ left: '3rem' }}
                  onClick={() => openScreen('assets')}
                >
                  <h3>Manage Protocol</h3>
                  <h2>Resources</h2>
                </GraphicButton>
                <GraphicButton
                  graphic={codebookGraphic}
                  color="neon-coral"
                  graphicPosition="90% center"
                  graphicSize="auto 90%"
                  labelPosition={{ left: '3rem' }}
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
