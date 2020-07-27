import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { motion } from 'framer-motion';
import { get } from 'lodash';
import { actionCreators as protocolsActions } from '@modules/protocols';
import createButtonGraphic from '@app/images/home/create-button.svg';
import openButtonGraphic from '@app/images/home/open-button.svg';
import resumeBackgroundGraphic from '@app/images/home/resume-background.svg';
import GraphicButton from '@components/GraphicButton';
import Welcome from './Welcome';
import Sprite from './Sprite';
import Section from './Section';
import Group from './Group';
import ProtocolCard from './ProtocolCard';

const getRecentProtocols = state =>
  get(state, 'recentProtocols', [])
    .slice(0, 1);

const states = {
  BUSY: Symbol('BUSY'),
  READY: Symbol('READY'),
};

const Home = ({
  openProtocol,
  createAndLoadProtocol,
  resumeProtocol,
  unbundleAndLoadProtocol,
}) => {
  const [state, setState] = useState(states.READY);

  const handleOpenProtocol = useCallback(() => {
    setState(states.BUSY);
    openProtocol().finally(() => setState(states.READY));
  }, [openProtocol, setState]);

  const handleCreateProtocol = useCallback(() => {
    setState(states.BUSY);
    createAndLoadProtocol().finally(() => setState(states.READY));
  }, [createAndLoadProtocol, setState]);

  const handleLoadProtocol = useCallback((filePath) => {
    setState(states.BUSY);
    unbundleAndLoadProtocol(filePath).finally(() => setState(states.READY));
  }, [unbundleAndLoadProtocol, setState]);

  const disableButtons = state !== states.READY;

  return (
    <motion.div
      className="home"
      initial="initial"
      animate="enter"
    >
      <motion.div
        className="home__container"
      >
        <Welcome />
        <Section>
          { resumeProtocol &&
            <Group>
              <Sprite
                src={resumeBackgroundGraphic}
                width="calc(50% - 7rem)"
                height="90%"
                position="absolute"
                bottom={0}
                right="5.7rem"
                opacity="0.33"
                backgroundPosition="top right"
                backgroundSize="100% auto"
              />
              <div className="home-left">
                <h2>Resume Editing</h2>
                <ProtocolCard
                  description={resumeProtocol.description}
                  lastModified={resumeProtocol.lastModified}
                  name={resumeProtocol.name}
                  onClick={() => handleLoadProtocol(resumeProtocol.filePath)}
                  disabled={disableButtons}
                  schemaVersion={resumeProtocol.schemaVersion}
                />
              </div>
            </Group>
          }
          <Group title="Create or Open" color="platinum">
            <div className="home-split">
              <div className="home-split__left">
                <GraphicButton
                  graphic={createButtonGraphic}
                  graphicPosition="1rem 3.15rem"
                  onClick={handleCreateProtocol}
                  disabled={disableButtons}
                >
                  <h2>Create</h2>
                  <h3>New Protocol</h3>
                </GraphicButton>
              </div>
              <div className="home-split__vr" />
              <div className="home-split__right">
                <GraphicButton
                  graphic={openButtonGraphic}
                  graphicPosition="1rem 3.15rem"
                  color="slate-blue--dark"
                  onClick={handleOpenProtocol}
                  disabled={disableButtons}
                >
                  <h2>Open</h2>
                  <h3>from Computer</h3>
                </GraphicButton>
              </div>
            </div>
          </Group>
        </Section>
      </motion.div>
    </motion.div>
  );
};

Home.propTypes = {
  openProtocol: PropTypes.func.isRequired,
  createAndLoadProtocol: PropTypes.func.isRequired,
  unbundleAndLoadProtocol: PropTypes.func.isRequired,
  resumeProtocol: PropTypes.object,
};

Home.defaultProps = {
  resumeProtocol: null,
};

const mapStateToProps = state => ({
  recentProtocols: getRecentProtocols(state),
  resumeProtocol: getRecentProtocols(state)[0],
});

const mapDispatchToProps = {
  createAndLoadProtocol: protocolsActions.createAndLoadProtocol,
  unbundleAndLoadProtocol: protocolsActions.unbundleAndLoadProtocol,
  openProtocol: protocolsActions.openProtocol,
};

const withState = connect(mapStateToProps, mapDispatchToProps);

export { Home };

export default withState(Home);
