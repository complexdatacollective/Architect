import path from 'path';
import React from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Icon, Button } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getActiveProtocol } from '@selectors/session';
import { getProtocol } from '@selectors/protocol';
import { actionCreators as protocolActions } from '@modules/protocol';
import { actionCreators as uiActions } from '@modules/ui';

const panelVariants = {
  hide: { opacity: 0, y: -200 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, when: 'beforeChildren' } },
};

const Overview = ({
  name,
  description,
  updateOptions,
  openScreen,
}) => (
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
            onChange: ({ target: { value } }) => (
              updateOptions({ description: value })
            ),
          }}
        />
      </div>
    </div>
    <div className="overview__footer">
      <Icon name="protocol-card" />
      <Button onClick={printSummary} color="neon-coral">Print Summary</Button>
      <Button onClick={() => openScreen('assets')} color="neon-coral">Resource Library</Button>
      <Button onClick={() => openScreen('codebook')} color="sea-serpent">Manage Codebook</Button>
    </div>
  </motion.div>
);

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Overview);
