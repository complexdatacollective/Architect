import React from 'react';
import Navigation from './Navigation';
import interfaceOptions from './interfaceOptions';
import InterfaceCategory from './InterfaceCategory';
import withCreateNewStage from './withCreateNewStage';

const categories = interfaceOptions.map(({ category }) => category);

const NewStage = ({
  handleCreateNew,
}) => {
  return (
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
  );
};

export { NewStage };

export default withCreateNewStage(NewStage);
