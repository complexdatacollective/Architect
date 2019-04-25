import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Guided from '../Guided';
import Navigation from './Navigation';
import interfaceOptions from './interfaceOptions';
import InterfaceCategory from './InterfaceCategory';
import withCreateNewStage from './withCreateNewStage';
import windowRootProvider from '../../ui/components/windowRootProvider';

const categories = interfaceOptions.map(({ category }) => category);

const NewStage = ({
  handleCreateNew,
  setWindowRoot,
}) => (
  <Guided defaultGuidance="guidance.new_stage">
    <div className="new-stage" ref={setWindowRoot}>
      <div className="new-stage__navigation">
        <Navigation categories={categories} />
      </div>
      <div className="new-stage__options">
        <h1>Choose a stage to add to your interview</h1>
        <p>
          Below you can find the available interfaces currently bundled in network canvas,
          grouped by type. Hover each interface with the guidance panel open to see further
          information.
        </p>

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
