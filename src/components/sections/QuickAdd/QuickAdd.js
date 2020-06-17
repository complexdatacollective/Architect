import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Section } from '@components/EditorLayout';
import VariableSelect from '../../Form/Fields/VariableSelect';
// import CreatableSelect from '../../Form/Fields/CreatableSelect';
import ValidatedField from '../../Form/ValidatedField';
import withOptions from './withOptions';
import withCreateVariableHandler from '../../enhancers/withCreateVariableHandler';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withDefaultToDisplayVariable from './withDefaultToDisplayVariable';
import withSubject from '../../enhancers/withSubject';
import Tip from '../../Tip';

/* select from text, or creat text, default to display */

const QuickAdd = ({
  disabled,
  entity,
  handleCreateVariable,
  handleDeleteVariable,
  normalizeKeyDown,
  options,
  type,
}) => (
  <Section disabled={disabled} group contentId="guidance.editor.quickAdd">
    <h3 id="issue-form">Quick Add Variable</h3>
    <p>
      Choose which variable to use to store the value of the quick add form. To create
      a new variable, type a name into the box below.
    </p>
    <Tip type="warning">
      <p>
        Use a variable called &quot;name&quot; unless you have a good reason not to.
        Network Canvas will then automatically use this variable as the label for the node in
        the interview.
      </p>
    </Tip>

    <div className="stage-editor-section-form">
      <ValidatedField
        name="quickAdd"
        component={VariableSelect}
        placeholder="Select an existing variable, or type to create a new one..."
        options={options}
        onCreateOption={value => handleCreateVariable(value, 'text')}
        onDeleteOption={handleDeleteVariable}
        onKeyDown={normalizeKeyDown}
        validation={{ required: true }}
        type={type}
        entity={entity}
        formatCreateLabel={inputValue => (
          <span>Click here to create a new variable named &quot;{inputValue}&quot;.</span>
        )}
      />
    </div>
  </Section>
);

QuickAdd.propTypes = {
  disabled: PropTypes.bool,
  entity: PropTypes.string.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  handleDeleteVariable: PropTypes.func.isRequired,
  normalizeKeyDown: PropTypes.func.isRequired,
  options: PropTypes.array,
  type: PropTypes.string.isRequired,
};

QuickAdd.defaultProps = {
  disabled: false,
  options: [],
};

export { QuickAdd };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withDefaultToDisplayVariable,
  withOptions,
  withCreateVariableHandler,
)(QuickAdd);

