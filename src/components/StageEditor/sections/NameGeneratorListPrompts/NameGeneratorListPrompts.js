import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Prompts from '../../../Prompts';
import NameGeneratorListPrompt from './NameGeneratorListPrompt';
import { getExternalDataSources } from '../../../../selectors/protocol';

const NameGeneratorListPrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_list_prompts"
    promptComponent={NameGeneratorListPrompt}
    template={{ showExistingNodes: true }}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to ecourage your participants to create
      nodes.
    </p>
  </Prompts>
);

NameGeneratorListPrompts.propTypes = {
  dataSources: PropTypes.array,
};

NameGeneratorListPrompts.defaultProps = {
  dataSources: [],
};

const mapStateToProps = (state) => {
  const dataSources = getExternalDataSources(state)
    .map(source => ({ value: source, label: source }));

  return {
    dataSources,
  };
};

export { NameGeneratorListPrompts };

export default connect(mapStateToProps)(NameGeneratorListPrompts);
