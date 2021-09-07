import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Section } from '@components/EditorLayout';
import VariableSelect from '../../Form/Fields/VariableSelect';
import ValidatedField from '../../Form/ValidatedField';
import withOptions from './withOptions';
import withCreateVariableHandler from '../../enhancers/withCreateVariableHandler';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withQuickAddVariable from './withQuickAddVariable';
import withSubject from '../../enhancers/withSubject';
import Tip from '../../Tip';

/* select from text, or creat text, default to display */

const QuickAdd = ({
  disabled,
  entity,
  handleCreateVariable,
  options,
  type,
  quickAdd,
}) => (
  type
  && (
  <Section disabled={disabled} group>
    <h3 id="issue-form">Quick Add Variable</h3>
    <p>
      Choose which variable to use to store the value of the quick add form.
    </p>
    <Tip type="warning">
      <p>
        Create a variable called &quot;name&quot; here, unless you have a good reason not to.
        Interviewer will then automatically use this variable as the label for the node in
        the interview.
      </p>
    </Tip>

    <div className="stage-editor-section-form">
      <ValidatedField
        name="quickAdd"
        component={VariableSelect}
        options={options}
        onCreateOption={(value) => handleCreateVariable(value, 'text', 'quickAdd')}
        validation={{ required: true }}
        type={type}
        entity={entity}
        variable={quickAdd}
      />
    </div>
  </Section>
  )
);

QuickAdd.propTypes = {
  disabled: PropTypes.bool,
  entity: PropTypes.string.isRequired,
  handleCreateVariable: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
  type: PropTypes.string,
};

QuickAdd.defaultProps = {
  disabled: false,
  type: null,
  options: [],
};

export { QuickAdd };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withQuickAddVariable,
  withOptions,
  withCreateVariableHandler,
)(QuickAdd);
