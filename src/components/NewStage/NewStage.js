import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import windowRootProvider from '@codaco/ui/lib/components/windowRootProvider';
import { Section } from '@components/EditorLayout';
import Guided from '../Guided';
import Navigation from './Navigation';
import interfaceOptions from './interfaceOptions';
import InterfaceCategory from './InterfaceCategory';
import withCreateNewStage from './withCreateNewStage';

const categories = interfaceOptions.map(({ category }) => category);

const NewStage = ({
  handleCreateNew,
  setWindowRoot,
}) => (
  <Guided defaultGuidance="guidance.new_stage">
    <div className="new-stage" ref={setWindowRoot}>
      <Section>
        <h1>Choose an interface to create a stage from</h1>
        <p>
          Below you can find the available interfaces currently bundled in network canvas,
          grouped by type.
        </p>
      </Section>
      <div className="new-stage__options">
        <div className="new-stage__navigation">
          <Navigation categories={categories} />
        </div>
        {interfaceOptions.map((props, index) => (
          <div className="new-stage__category" key={index}>
            <InterfaceCategory {...props} onSelect={handleCreateNew} />
          </div>
        ))}
      </div>
    </div>
  </Guided>
);

NewStage.propTypes = {
  handleCreateNew: PropTypes.func.isRequired,
  setWindowRoot: PropTypes.func.isRequired,
};

export { NewStage };

export default compose(
  withCreateNewStage,
  windowRootProvider,
)(NewStage);
