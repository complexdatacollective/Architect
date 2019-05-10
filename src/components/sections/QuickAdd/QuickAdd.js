import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
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
    <h3 id="issue-form">Quick Add Variable</h3>
    <p>
      Choose which variable to use to store the value of the quick add form. To create
      a new variable, type a name into the box below.
    </p>
    <p>
      <strong>
        Tip: create or assign a variable called &quot;name&quot; and network
        canvas will automatically use it as a label.
      </strong>
    </p>
    <div className="stage-editor-section-form">
      <ValidatedField
        name="quickAdd"
        component={CreatableSelect}
        placeholder="Select an existing variable, or type to create a new one..."
        options={options}
        onCreateOption={value => handleCreateVariable(value, 'text')}
        onDeleteOption={handleDeleteVariable}
        validation={{ required: true }}
        formatCreateLabel={inputValue => (
          <span>Press enter to create a new variable named &quot;{inputValue}&quot;.</span>
        )}
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
