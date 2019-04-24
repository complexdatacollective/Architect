import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Guidance from '../../Guidance';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import ValidatedField from '../../Form/ValidatedField';
import Section from '../Section';
import withOptions from './withOptions';
import withCreateVariableHandler from '../../enhancers/withCreateVariableHandler';
import withDefaultToDisplayVariable from './withDefaultToDisplayVariable';
import withSubject from '../../enhancers/withSubject';

/* select from text, or creat text, default to display */

const QuickAdd = ({
  disabled,
  options,
  handleCreateVariable,
  handleDeleteVariable,
}) => (
  <Section disabled={disabled} group contentId="guidance.editor.quickAdd">
    <h3 id="issue-form">Quick Variable</h3>
    <p>Choose a varible to set for the quick add input</p>
    <div className="stage-editor-section-form">
      <ValidatedField
        name="quickAdd"
        component={CreatableSelect}
        placeholder="Select component"
        options={options}
        onCreateOption={value => handleCreateVariable(value, 'text')}
        onDeleteOption={handleDeleteVariable}
        validation={{ required: true }}
      />
    </div>
  </Section>
);

QuickAdd.propTypes = {
  disabled: PropTypes.bool,
  options: PropTypes.array,
  handleCreateVariable: PropTypes.func.isRequired,
  handleDeleteVariable: PropTypes.func.isRequired,
};

QuickAdd.defaultProps = {
  disabled: false,
  options: [],
};

export { QuickAdd };

export default compose(
  withSubject,
  withDefaultToDisplayVariable,
  withOptions,
  withCreateVariableHandler,
)(QuickAdd);
