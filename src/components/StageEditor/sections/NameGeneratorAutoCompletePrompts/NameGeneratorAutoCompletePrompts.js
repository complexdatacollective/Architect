import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Prompts from '../../../Prompts';
import NameGeneratorPrompt from './NameGeneratorAutoCompletePrompt';
import { getExternalDataSources } from '../../../../selectors/protocol';

const NameGeneratorAutoCompletePrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_auto_complete_prompts"
    promptComponent={NameGeneratorPrompt}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to ecourage your participants to create
      nodes.
    </p>
  </Prompts>
);

NameGeneratorAutoCompletePrompts.propTypes = {
  dataSources: PropTypes.array,
};

NameGeneratorAutoCompletePrompts.defaultProps = {
  dataSources: [],
};

const mapStateToProps = (state) => {
  const dataSources = getExternalDataSources(state)
    .map(source => ({ value: source, label: source }));

  return {
    dataSources,
  };
};

export { NameGeneratorAutoCompletePrompts };

export default connect(mapStateToProps)(NameGeneratorAutoCompletePrompts);
