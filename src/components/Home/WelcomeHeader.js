import React from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';
import networkCanvasLogo from '@app/images/network-canvas-brand.svg';
import headerGraphic from '@app/images/home/header-icon.svg';
import videoPlaceholder from '@app/images/home/video-placeholder.svg';
import Version from '@components/Version';
import Sprite from './Sprite';
import Section from './Section';
import Group from './Group';
import Switch from './Switch';
import useAppState from './useAppState';

const WelcomeHeader = () => {
  const [isOpen, setIsOpen] = useAppState('showWelcome', false);

  const classes = cx(
    'welcome-header',
    { 'welcome-header--is-open': isOpen },
  );

  return (
    <Section className={classes} allowOverflow>
      <Group color="slate-blue" className="welcome-header__header">
        <div className="welcome-header__title">
          <img src={networkCanvasLogo} alt="A Network Canvas project" style={{ height: '2rem', width: '2rem' }} />
          <h1>Architect</h1>
          <p>A tool for creating Network Canvas Interviews</p>
        </div>
        <Sprite
          src={headerGraphic}
          height="20rem"
          width="26rem"
        />

        <Version />
        <Switch
          className="welcome-header__header-toggle"
          label="Show welcome"
          on={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
      </Group>
      <motion.div
        className="welcome-header__panel"
        initial={{ height: 'auto' }}
        animate={{ height: isOpen ? 'auto' : 0 }}
      >
        <Group
          color="slate-blue--dark"
          className="home-welcome"
        >
          <div className="home-welcome__video">
            <div className="aspect-ratio aspect-ratio--16_10">
              <Sprite
                src={videoPlaceholder}
                backgroundSize="125%"
                backgroundPosition="center center"
              />
            </div>
          </div>
          <div className="home-welcome__content">
            <h2>Welcome</h2>
            <p>Welcome to Network Canvas Architect! To get started, use the buttons above to
              create a new interview protocol, or open an existing one from elsewhere. When you
              return to this screen later, recent protocols you have opened will be shown here.
            </p>
          </div>
        </Group>
      </motion.div>
    </Section>
  );
};

export default WelcomeHeader;
