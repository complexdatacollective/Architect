import React from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import networkCanvasLogo from '@app/images/NC-Mark.svg';
import headerGraphic from '@app/images/home/header-icon.svg';
import videoPlaceholder from '@app/images/home/video-placeholder.svg';
import Version from '@components/Version';
import Sprite from './Sprite';
import Section from './Section';
import Group from './Group';
import Switch from './Switch';
import useAppState from './useAppState';


const WelcomeHeader = () => {
  const [isOpen, setIsOpen] = useAppState('showWelcome', true);

  const classes = cx(
    'welcome-header',
    { 'welcome-header--is-open': isOpen },
  );

  return (
    <Section className={classes} allowOverflow>
      <Group color="slate-blue" className="welcome-header__header">
        <div className="welcome-header__title">
          <div className="project-tag">
            <img src={networkCanvasLogo} alt="A Network Canvas project" style={{ height: '2.4rem', width: '2.4rem' }} />
            <h5>Network Canvas</h5>
          </div>
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
        initial={{ height: 0 }}
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
            <h2>Welcome to Architect!</h2>
            <p>
              If you are new to the software, please consider watching the overview
              video to the left. It will explain how the software works, and introduce
              all the essential skills needed to build an interview protocol. We also
              have extensive tutorials and information on a range of topics on our
              documentation website, which you can visit using the link below.
            </p>
            <Button>Visit Documentation Website</Button>
            <p>
              Alternatively, to get started right away use the buttons below to
              create a new interview protocol, or open an existing one from elsewhere
            </p>
            <p>
              Thank you for supporting the Network Canvas project!
            </p>
          </div>
        </Group>
      </motion.div>
    </Section>
  );
};

export default WelcomeHeader;
