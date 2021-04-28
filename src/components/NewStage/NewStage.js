import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import windowRootProvider from '@codaco/ui/lib/components/windowRootProvider';
import { Section } from '@components/EditorLayout';
import Navigation from './Navigation';
import interfaceOptions from './interfaceOptions';
import InterfaceCategory from './InterfaceCategory';
import withCreateNewStage from './withCreateNewStage';
import ExternalLink from '../ExternalLink';

const categories = interfaceOptions.map(({ category }) => category);

const NewStage = ({
  handleCreateNew,
  setWindowRoot,
}) => (
  <div className="new-stage" ref={setWindowRoot}>
    <Section>
      <h1>Add a Stage</h1>
      <p>
        Below you can find the available interfaces currently bundled in Interviewer,
        grouped by type. For further details about each of these interfaces, please visit
        our
        {' '}
        <ExternalLink href="https://documentation.networkcanvas.com/reference/interface-documentation/">documentation</ExternalLink>
        .
      </p>
    </Section>
    <div className="new-stage__options">
      <div className="new-stage__navigation">
        <Navigation categories={categories} />
      </div>
      {interfaceOptions.map((props, index) => (
        <div
          className="new-stage__category"
          // eslint-disable-next-line react/no-array-index-key
          key={index}
        >
          <InterfaceCategory
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            onSelect={handleCreateNew}
          />
        </div>
      ))}
    </div>
  </div>
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
