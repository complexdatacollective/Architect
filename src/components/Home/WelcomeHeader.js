import React from 'react';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import networkCanvasLogo from '@app/images/NC-Mark.svg';
import headerGraphic from '@app/images/Arc-Flat.svg';
import Version from '@components/Version';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Group from './Group';
import Switch from './Switch';
import useAppState from './useAppState';
import { openExternalLink } from '../ExternalLink';
import Section from './Section';
import { actionCreators as userActions } from '../../ducks/modules/userActions/userActions';
import inEnvironment from '../../utils/Environment';
import environments from '../../utils/environments';
import friendlyErrorMessage from '../../utils/friendlyErrorMessage';
import { writeFile } from "../../utils/fileSystem";

const WelcomeHeader = ({
  openNetcanvas
}) => {
  const [isOpen, setIsOpen] = useAppState('showWelcome', true);

  const classes = cx(
    'home-section',
    'welcome-header',
    { 'welcome-header--is-open': isOpen },
  );

  const start = {
    show: {
      opacity: 1,
      height: '100%',
      transition: {
        stiffness: 100,
        dampening: 10,
      },
    },
    hide: {
      opacity: 0,
      height: '0px',
      transition: {
        duration: 0.5,
      },
    },
  };

  const getURL = uri =>
  new Promise((resolve, reject) => {
    try {
      resolve(new URL(uri));
    } catch (error) {
      reject(error);
    }
  });

const urlError = friendlyErrorMessage("The location you gave us doesn't seem to be a valid URL. Check the location, and try again.");
const networkError = friendlyErrorMessage("We weren't able to fetch your protocol. Your device may not have an active network connection, or you may have mistyped the URL. Ensure you are connected to a network, double check your URL, and try again.");
const fileError = friendlyErrorMessage('The protocol could not be saved to your device. You might not have enough storage available. ');

/**
 * Download a protocol from a remote server.
 *
 * If the URL points to an instance of a Network Canvas Server, then the caller must ensure
 * that the SSL certificate has been trusted. See {@link ApiClient#addTrustedCert}.
 *
 * @param {string} uri
 * @return {string} output filepath
 */
const downloadProtocolFromURI = inEnvironment((environment)=> {

  if (environment === environments.ELECTRON) {
    const request = require('request-promise-native');
    const path = require('path');
    const electron = require('electron');
    const { dialog } = electron.remote
    const tempPath = (electron.app || electron.remote.app).getPath('temp');
    const from = path.join(tempPath, 'SampleProtocol') + '.netcanvas';
    const fs = require('fs')

    const selectPath = new Promise(function(resolve, reject){
      dialog.showOpenDialog(null, {
        properties: ['openDirectory']
      })
      .then((result) => {
        if (result.filePaths.toString() !== ''){
          const destination = path.join(result.filePaths.toString(), 'SampleProtocol') + '.netcanvas';
          resolve(destination);
        }
      })
    })
      
    return (uri) => {
      selectPath
        .then((destination) => {
          let promisedResponse;
          promisedResponse = getURL(uri)
            .catch(urlError)
            .then(url => request({ method: 'GET', encoding: null, uri: url.href }));

          return promisedResponse
            .catch(networkError)
            .then(data => writeFile(from, data))
            .catch(fileError)
            .then(() => {
              fs.rename(from, destination, function(err){
                if (err){
                  throw error;
                }
                else {
                  console.log("Successfully moved the file")
                }
              })
            })
            .then(() => {
              openNetcanvas(destination)
            })
        })
    };
  }

  return () => Promise.reject(new Error('downloadProtocolFromURI() not available on platform'));
});


  return (
    <Section
      className={classes}
    >
      <Group className="welcome-header__header">
        <img className="logo" src={headerGraphic} alt="Network Canvas Architect" />
        <div className="welcome-header__title">
          <div className="project-tag">
            <img src={networkCanvasLogo} alt="A Network Canvas project" style={{ height: '2.4rem', width: '2.4rem' }} />
            <h5>Network Canvas</h5>
          </div>
          <h1>Architect</h1>
          <p>A tool for building Network Canvas Interviews</p>
        </div>
        <Version />
        <Switch
          className="welcome-header__header-toggle"
          label="Show welcome"
          on={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
      </Group>
      <motion.section
        className="welcome-header__panel"
      >
        <AnimatePresence initial={false}>
          { isOpen && (
            <motion.div
              variants={start}
              initial="hide"
              animate="show"
              exit="hide"
            >
              <Group
                className="home-welcome"
              >
                <div className="home-welcome__content">
                  <h2>Welcome to Architect!</h2>
                  <p>
                    If you are new to the software, please consider watching the overview
                    video to the left. It will explain how the software works, and introduce
                    all the essential skills needed to build an interview protocol. We also
                    have extensive tutorials and information on a range of topics on our
                    documentation website, which you can visit using the link below.
                  </p>
                  <p>
                    Alternatively, to get started right away use the buttons below to
                    create a new interview protocol, or open an existing one from elsewhere.
                  </p>
                  <div className="welcome-actions">
                    <Button
                      color="primary"
                      onClick={() => openExternalLink('https://www.youtube.com/watch?v=XzfE6j-LnII')}
                    >
                      Watch overview video
                    </Button>
                    <Button
                      color="sea-serpent"
                      onClick={() => openExternalLink('https://documentation.networkcanvas.com')}
                    >
                      Visit documentation website
                    </Button>
                    <Button
                      color="mustard"
                      onClick={() => downloadProtocolFromURI('https://documentation.networkcanvas.com/protocols/Sample%20Protocol%20v3.netcanvas')}
                    >
                      Install Sample Protocol
                    </Button>
                  </div>
                </div>
              </Group>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </Section>
  );
};

WelcomeHeader.PropTypes = {
  openNetcanvas: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  openNetcanvas: userActions.openNetcanvas,
};

const withState = connect(null, mapDispatchToProps);

export default withState(WelcomeHeader);
