import React from 'react';
import PropTypes from 'prop-types';
import Guided from '../Guided';
import Navigation from './Navigation';
import interfaceOptions from './interfaceOptions';
import InterfaceCategory from './InterfaceCategory';
import withCreateNewStage from './withCreateNewStage';

const categories = interfaceOptions.map(({ category }) => category);

const NewStage = ({
  handleCreateNew,
}) => (
  <Guided defaultGuidance="guidance.new_stage">
    <div className="new-stage">
      <div className="new-stage__navigation">
        <Navigation categories={categories} />
      </div>
      <div className="new-stage__options">
        <h1>New Stage</h1>
        <p>Brief intro text here?</p>
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
};

export { NewStage };

export default withCreateNewStage(NewStage);
