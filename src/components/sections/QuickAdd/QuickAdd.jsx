import { Section } from '@components/EditorLayout';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import withCreateVariableHandler from '../../enhancers/withCreateVariableHandler';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withSubject from '../../enhancers/withSubject';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';
import ValidatedField from '../../Form/ValidatedField';
import Tip from '../../Tip';
import withOptions from './withOptions';
import withQuickAddVariable from './withQuickAddVariable';

/* select from text, or creat text, default to display */

const QuickAdd = ({
  disabled,
  entity,
  handleCreateVariable,
  options,
  type,
  quickAdd,
}) =>
  type && (
    <Section
      disabled={disabled}
      group
      title="Quick Add Variable"
      id="issue-form"
    >
      <p>
        Choose which variable to use to store the value of the quick add form.
      </p>
      <Tip type="info">
        <p>
          Use a variable called &quot;name&quot; here, unless you have a good
          reason not to. Interviewer will then automatically use this variable
          as the label for the node in the interview.
        </p>
      </Tip>
      <div className="stage-editor-section-form">
        <ValidatedField
          name="quickAdd"
          component={VariablePicker}
          options={options}
          onCreateOption={(value) =>
            handleCreateVariable(value, 'text', 'quickAdd')
          }
          validation={{ required: true }}
          type={type}
          entity={entity}
          label="Quick Add Variable"
          variable={quickAdd}
        />
      </div>
    </Section>
  );

QuickAdd.propTypes = {
  disabled: PropTypes.bool,
  entity: PropTypes.string.isRequired,
  quickAdd: PropTypes.string,
  handleCreateVariable: PropTypes.func.isRequired,
  options: PropTypes.array,
  type: PropTypes.string,
};

QuickAdd.defaultProps = {
  disabled: false,
  quickAdd: null,
  type: null,
  options: [],
};

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withQuickAddVariable,
  withOptions,
  withCreateVariableHandler,
)(QuickAdd);
