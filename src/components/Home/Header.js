import React from 'react';
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

const Header = () => {
  const [isOpen, setIsOpen] = useAppState('showWelcome', false);

  return (
    <Section allowOverflow>
      <Sprite
        src={headerGraphic}
        height="25rem"
        width="25rem"
        position="absolute"
        top="7rem"
        left="40%"
        transform="translateY(-50%)"
        zIndex="1"
      />
      <div className="home-header">
        <Group color="slate-blue" className="home-header__container">
          <div className="home-header__title">
            <img src={networkCanvasLogo} alt="A Network Canvas project" style={{ height: '2rem', width: '2rem' }} />
            <h1>Architect</h1>
            <p>A tool for creating Network Canvas Interviews</p>
          </div>
          <Version />
          <motion.div
            className="home-header__show-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
          >
            <Switch label="Show welcome" on={isOpen} onChange={() => setIsOpen(true)} />
          </motion.div>
        </Group>
        <motion.div
          initial={{ height: 'auto' }}
          animate={{ height: isOpen ? 'auto' : 0 }}
        >
          <Group color="slate-blue--dark">
            <div className="home-welcome">
              <div className="home-welcome__video">
                <div className="aspect-ratio">
                  <Sprite src={videoPlaceholder} backgroundSize="auto" backgroundPosition="top center" />
                </div>
              </div>
              <div className="home-welcome__content">
                <h2>Welcome</h2>
                <p>Welcome to Network Canvas Architect! To get started, use the buttons above to
                  create a new interview protocol, or open an existing one from elsewhere. When you
                  return to this screen later, recent protocols you have opened will be shown here.
                </p>

                <Switch label="Show welcome" on={isOpen} onChange={() => setIsOpen(false)} />
              </div>
            </div>
          </Group>
        </motion.div>
      </div>
    </Section>
  );
};

export default Header;
