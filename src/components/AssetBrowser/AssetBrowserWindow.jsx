import React from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import Button from '@codaco/ui/lib/components/Button';
import { Layout } from '@components/EditorLayout';
import ControlBar from '../ControlBar';
import Screen from '../Screen/Screen';
import AssetBrowser from './AssetBrowser';
import { screenVariants } from '../Screens/Screens';

const AssetBrowserWindow = ({
  show,
  type,
  selected,
  onCancel,
  onSelect,
}) => {
  const cancelButton = [(
    <Button
      color="platinum"
      onClick={onCancel}
      key="cancel"
    >
      Cancel
    </Button>
  )];

  if (!show) { return null; }

  return createPortal(
    <AnimatePresence>
      { show && (
        <motion.div
          variants={screenVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="screens-container"
        >
          <Screen
            header={(
              <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
                <Layout>
                  <h2>Resource Browser</h2>
                </Layout>
              </div>
            )}
            footer={(
              <ControlBar
                buttons={cancelButton}
              />
            )}
          >
            <Layout>
              <AssetBrowser
                type={type}
                onSelect={onSelect}
                selected={selected}
                disableDelete
              />
            </Layout>
          </Screen>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

AssetBrowserWindow.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
};

AssetBrowserWindow.defaultProps = {
  show: true,
  type: null,
  selected: null,
  onSelect: () => {},
  onCancel: () => {},
};

export default AssetBrowserWindow;
