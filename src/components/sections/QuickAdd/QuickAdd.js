import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Guidance from '../../Guidance';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import ValidatedField from '../../Form/ValidatedField';
import Section from '../Section';
import withOptionsForNodeType from './withOptionsForNodeType';
import withCreateVariableHandler from '../../enhancers/withCreateVariableHandler';
import withDefaultToDisplayVariable from './withDefaultToDisplayVariable';
import withSubjectNodeType from '../../EditableList/withSubjectNodeType';

/* select from text, or creat text, default to display */

const QuickAdd = ({
  disabled,
  options,
  handleCreateVariable,
}) => (
  <React.Fragment>
    <Guidance contentId="guidance.editor.quickAdd">
      <Section disabled={disabled} group>
        <h3 id="issue-form">Quick Variable</h3>
        <p>Choose a varible to set for the quick add input</p>
        <div className="stage-editor-section-form">
          <ValidatedField
            name="quickAdd"
            component={CreatableSelect}
            placeholder="Select component"
            options={options}
            onCreateOption={value => handleCreateVariable(value, 'text')}
            validation={{ required: true }}
          />
        </div>
      </Section>
    </Guidance>
  </React.Fragment>
);

QuickAdd.propTypes = {
  disabled: PropTypes.bool,
  options: PropTypes.array,
  handleCreateVariable: PropTypes.func.isRequired,
};

QuickAdd.defaultProps = {
  disabled: false,
  options: [],
};

export { QuickAdd };

export default compose(
  withSubjectNodeType,
  withDefaultToDisplayVariable,
  withOptionsForNodeType,
  withCreateVariableHandler,
)(QuickAdd);
