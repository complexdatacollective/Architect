import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, first } from 'lodash';
import { GraphicButton } from '@codaco/ui';
import { ProtocolCard } from '@codaco/ui/lib/components/Cards';
import { actionCreators as protocolsActions } from '@modules/protocols';
import createButtonGraphic from '@app/images/home/create-button.svg';
import openButtonGraphic from '@app/images/home/open-button.svg';
import Section from './Section';
import Group from './Group';

const LaunchPad = ({
  openProtocol,
  createAndLoadProtocol,
  lastEditedProtocol,
  otherRecentProtocols,
  unbundleAndLoadProtocol,
}) => {
  const handleOpenProtocol = () => openProtocol();

  const handleCreateProtocol = () => createAndLoadProtocol();

  const handleLoadProtocol = filePath =>
    unbundleAndLoadProtocol(filePath);

  return (
    <React.Fragment>
      { lastEditedProtocol &&
        <Section className="launch-pad">
          <Group color="sea-green" className="resume-group home-group--flex">
            <div className="launch-pad__resume">
              <h2>Resume Editing</h2>
              <ProtocolCard
                description={lastEditedProtocol.filePath}
                lastModified={lastEditedProtocol.lastModified}
                name={lastEditedProtocol.name}
                onClickHandler={() => handleLoadProtocol(lastEditedProtocol.filePath)}
                schemaVersion={lastEditedProtocol.schemaVersion}
              />
            </div>
            <div className="launch-pad__action-divider" />
            <div className="launch-pad__resume">
              {
                otherRecentProtocols.map(protocol => (
                  <ProtocolCard
                    key={protocol.filePath}
                    condensed
                    description={protocol.filePath}
                    lastModified={protocol.lastModified}
                    name={protocol.name}
                    onClickHandler={() => handleLoadProtocol(protocol.filePath)}
                    schemaVersion={protocol.schemaVersion}
                  />
                ))
              }
            </div>
          </Group>
        </Section>
      }
      <Section className="launch-pad">
        <Group>
          <h2>Create or Open</h2>
          <div className="launch-pad__actions">
            <div className="launch-pad__action">
              <GraphicButton
                graphic={createButtonGraphic}
                graphicPosition="20% bottom"
                graphicSize="auto 90%"
                onClick={handleCreateProtocol}
              >
                <h2>Create</h2>
                <h3>New Protocol</h3>
              </GraphicButton>
            </div>
            <div className="launch-pad__action-divider" />
            <div className="launch-pad__action">
              <GraphicButton
                graphic={openButtonGraphic}
                graphicPosition="0 bottom"
                color="slate-blue--dark"
                graphicSize="auto 115%"
                onClick={handleOpenProtocol}
              >
                <h2>Open</h2>
                <h3>from Computer</h3>
              </GraphicButton>
            </div>
          </div>
        </Group>
      </Section>
    </React.Fragment>
  );
};

LaunchPad.propTypes = {
  openProtocol: PropTypes.func.isRequired,
  createAndLoadProtocol: PropTypes.func.isRequired,
  unbundleAndLoadProtocol: PropTypes.func.isRequired,
  lastEditedProtocol: PropTypes.object,
  otherRecentProtocols: PropTypes.array,
};

LaunchPad.defaultProps = {
  lastEditedProtocol: null,
  otherRecentProtocols: [],
};

const mapStateToProps = (state) => {
  const recentProtocols = get(state, 'recentProtocols', [])
    .filter(meta => !!meta.schemaVersion);

  return {
    lastEditedProtocol: first(recentProtocols),
    otherRecentProtocols: recentProtocols.slice(1, 4),
  };
};

const mapDispatchToProps = {
  createAndLoadProtocol: protocolsActions.createAndLoadProtocol,
  unbundleAndLoadProtocol: protocolsActions.unbundleAndLoadProtocol,
  openProtocol: protocolsActions.openProtocol,
};

const withState = connect(mapStateToProps, mapDispatchToProps);

export { LaunchPad };

export default withState(LaunchPad);
