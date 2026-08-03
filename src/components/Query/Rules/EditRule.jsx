import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { createPortal } from 'react-dom';

import Button from '@codaco/ui/lib/components/Button';

import ControlBar from '../../ControlBar';
import Layout from '../../EditorLayout/Layout';
import ExternalLink from '../../ExternalLink';
import CollapsableHeader from '../../Screen/CollapsableHeader';
import Screen from '../../Screen/Screen';
import { screenVariants } from '../../Screens/Screens';
import EditEgoRule from './EditEgoRule';
import EditEntityRule from './EditEntityRule';

class EditRule extends Component {
  get TypeComponent() {
    const {
      rule: { type },
    } = this.props;
    if (type === 'ego') {
      return EditEgoRule;
    }

    return EditEntityRule;
  }

  handleSave = () => {
    const { onSave } = this.props;
    onSave();
  };

  render() {
    const { rule, codebook, onChange, onCancel, onSave } = this.props;

    return createPortal(
      <AnimatePresence>
        {!!rule && (
          <motion.div
            variants={screenVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="screens-container"
          >
            <Screen
              className="rule-screen"
              footer={
                <ControlBar
                  buttons={[
                    <Button
                      key="cancel"
                      type="button"
                      onClick={onCancel}
                      color="platinum"
                    >
                      Cancel
                    </Button>,
                    <Button
                      key="save"
                      type="button"
                      onClick={onSave}
                      color="primary"
                    >
                      Finish and Close
                    </Button>,
                  ]}
                />
              }
            >
              <CollapsableHeader
                collapsedState={
                  <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
                    <Layout>
                      <h2>Construct a Rule</h2>
                    </Layout>
                  </div>
                }
              >
                <div className="stage-heading stage-heading--inline">
                  <Layout>
                    <h1 className="screen-heading">Construct a Rule</h1>
                    <p>
                      For help with constructing rules, see our documentation
                      articles on{' '}
                      <ExternalLink href="https://documentation.networkcanvas.com/key-concepts/skip-logic/">
                        skip logic
                      </ExternalLink>{' '}
                      and{' '}
                      <ExternalLink href="https://documentation.networkcanvas.com/key-concepts/network-filtering/">
                        network filtering
                      </ExternalLink>
                      .
                    </p>
                  </Layout>
                </div>
              </CollapsableHeader>
              {rule?.options && (
                <this.TypeComponent
                  rule={rule}
                  codebook={codebook}
                  onChange={onChange}
                />
              )}
            </Screen>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  }
}

EditRule.propTypes = {
  rule: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.object,
  }),
  codebook: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

EditRule.defaultProps = {
  rule: {
    type: null,
    options: null,
  },
};

export default EditRule;
