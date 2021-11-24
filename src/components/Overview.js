import path from 'path';
import React from 'react';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Icon, Button } from '@codaco/ui';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { getActiveProtocol, getHasUnsavedChanges, getIsProtocolValid } from '@selectors/session';
import { getProtocol } from '@selectors/protocol';
import { actionCreators as protocolActions } from '@modules/protocol';
import { actionCreators as uiActions } from '@modules/ui';
import { actionCreators as userActions } from '@modules/userActions';
import PrintIcon from '@material-ui/icons/Print';
import withTooltip from './enhancers/withTooltip';

const panelVariants = {
  hide: { opacity: 0, y: -200 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, when: 'beforeChildren' } },
};

const PrintableSummaryButton = withTooltip(Button);

const Overview = ({
  name,
  description,
  updateOptions,
  openScreen,
  printOverview,
  protocolIsValid,
  hasUnsavedChanges,
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
      <div className="icon">
        <Icon name="protocol-card" />
      </div>
      <div className="action-buttons">
        <PrintableSummaryButton
          onClick={printOverview}
          color="slate-blue"
          icon={<PrintIcon />}
          disabled={!protocolIsValid || hasUnsavedChanges}
          tooltip={hasUnsavedChanges ? 'You must save your protocol before you can view the printable summary.' : null}
        >
          Printable Summary
        </PrintableSummaryButton>
        <motion.div
          layoutId="resource-library"
        >
          <Button onClick={() => openScreen('assets', { id: 'resource-library' })} color="neon-coral">Resource Library</Button>
        </motion.div>
        <motion.div
          layoutId="manage-codebook"
        >
          <Button onClick={() => openScreen('codebook', { id: 'manage-codebook' })} color="sea-serpent">Manage Codebook</Button>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  updateOptions: PropTypes.func,
  openScreen: PropTypes.func.isRequired,
  printOverview: PropTypes.func.isRequired,
  protocolIsValid: PropTypes.bool.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
};

Overview.defaultProps = {
  name: null,
  description: '',
  updateOptions: () => {},
};

const mapDispatchToProps = {
  updateOptions: protocolActions.updateOptions,
  printOverview: userActions.printOverview,
  openScreen: uiActions.openScreen,
};

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);
  const filePath = getActiveProtocol(state);
  const fileName = filePath && path.basename(filePath);
  const protocolIsValid = getIsProtocolValid(state);
  const hasUnsavedChanges = getHasUnsavedChanges(state);

  return {
    name: fileName,
    description: protocol && protocol.description,
    codebook: protocol && protocol.codebook,
    protocolIsValid,
    hasUnsavedChanges,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Overview);
