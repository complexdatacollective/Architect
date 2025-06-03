import path from 'path';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
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
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import withTooltip from './enhancers/withTooltip';

const panelVariants = {
  hide: { opacity: 0, y: -200 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } },
};

const summaryVariants = {
  hide: { opacity: 0, y: -200 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -200,
  },
};

const buttonVariants = {
  hide: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0 },
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
  scrollOffset,
}) => {
  const renderActionButtons = useCallback((collapsed = false) => (
    <div className="action-buttons">
      <motion.div
        variants={buttonVariants}
        className="action-buttons__button"
        title="Printable Summary"
      >
        <PrintableSummaryButton
          onClick={printOverview}
          color="slate-blue"
          icon={<PrintIcon />}
          disabled={!protocolIsValid || hasUnsavedChanges}
          tooltip={hasUnsavedChanges ? 'You must save your protocol before you can view the printable summary.' : null}
          content={collapsed ? null : 'Printable Summary'}
        />
      </motion.div>
      <motion.div
        variants={buttonVariants}
        className="action-buttons__button"
        title="Resource Library"
      >
        <Button
          onClick={() => openScreen('assets', { id: 'resource-library' })}
          color="neon-coral"
          icon={<PermMediaIcon />}
          content={collapsed ? null : 'Resource Library'}
        />
      </motion.div>
      <motion.div
        variants={buttonVariants}
        className="action-buttons__button"
        title="Manage Codebook"
      >
        <Button
          onClick={() => openScreen('codebook', { id: 'manage-codebook' })}
          color="sea-serpent"
          icon={<MenuBookIcon />}
          content={collapsed ? null : 'Manage Codebook'}
        />
      </motion.div>
    </div>
  ));

  const renderSummary = useCallback(() => (
    <motion.div
      key="summary"
      className="overview-summary"
      variants={summaryVariants}
      initial="hide"
      animate="show"
      exit="exit"
    >
      <div className="overview-summary__header">
        <h3>{name}</h3>
      </div>
      {renderActionButtons(true)}
    </motion.div>
  ));

  return (
    <AnimatePresence>
      { scrollOffset > 300 && renderSummary()}
      <motion.div
        className="overview"
        variants={panelVariants}
        key="overview"
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
          { renderActionButtons() }
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  updateOptions: PropTypes.func,
  openScreen: PropTypes.func.isRequired,
  printOverview: PropTypes.func.isRequired,
  protocolIsValid: PropTypes.bool.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  scrollOffset: PropTypes.number.isRequired,
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
