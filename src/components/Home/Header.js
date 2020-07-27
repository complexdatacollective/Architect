
import React from 'react';
import PropTypes from 'prop-types';
import networkCanvasLogo from '@app/images/network-canvas-brand.svg';
import headerGraphic from '@app/images/home/header-icon.svg';
import videoPlaceholder from '@app/images/home/video-placeholder.svg';
import Version from '@components/Version';
import Sprite from './Sprite';
import Section from './Section';
import Group from './Group';

const Header = ({ showWelcome }) => (
  <Section allowOverflow>
    <Group color="slate-blue" roundedCorners={[true, true, false, false]}>
      <div className="home-header">
        <img src={networkCanvasLogo} alt="A Network Canvas project" style={{ height: '.5rem' }} />
        <h1>Architect</h1>
        <p>A tool for creating Network Canvas Interviews</p>
        <Sprite
          src={headerGraphic}
          height="26rem"
          width="26rem"
          position="absolute"
          top="50%"
          left="45%"
          transform="translateY(-50%)"
          zIndex="2"
        />
        <Version />
        { !showWelcome &&
          <label htmlFor="showOnStartupHeader" className="home-header__show-welcome">
            <input type="checkbox" id="showOnStartupHeader" checked="checked" /> Show welcome
          </label>
        }
      </div>
    </Group>
    <Group color="slate-blue--dark" roundedCorners={[false, false, true, true]}>
      <div className="home-welcome">
        <div className="home-welcome__video">
          <div className="aspect-ratio">
            <Sprite src={videoPlaceholder} />
          </div>
        </div>
        <div className="home-welcome__content">
          <h1>Welcome</h1>
          <h3>Some info about the project goes here</h3>
          <p>Welcome to Network Canvas Architect! To get started, use the buttons above to
            create a new interview protocol, or open an existing one from elsewhere. When you
            return to this screen later, recent protocols you have opened will be shown here.</p>

          { showWelcome &&
            <label htmlFor="showOnStartup" className="home-welcome__toggle-panel">
              <input type="checkbox" id="showOnStartup" checked="checked" /> Show on startup
            </label>
          }
        </div>
      </div>
    </Group>
  </Section>
);

Header.propTypes = {
  showWelcome: PropTypes.bool,
};

Header.defaultProps = {
  showWelcome: false,
};

export default Header;
