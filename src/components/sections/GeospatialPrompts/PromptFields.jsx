import PromptText from '@components/sections/PromptText';
import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';

import { ValidatedField } from '@components/Form';
import { Section, Row } from '@components/EditorLayout';
import NewVariableWindow, {
  useNewVariableWindowState,
} from '@components/NewVariableWindow';
import withVariableHandlers from '@components/sections/CategoricalBinPrompts/withVariableHandlers'; // TODO: should these be moved somewhere more general?
import withVariableOptions from '@components/sections/CategoricalBinPrompts/withVariableOptions';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';

const VARIABLE_TYPE = 'location';

const PromptFields = ({
  variable, variableOptions, entity, type, changeForm, form,
}) => {
  const newVariableWindowInitialProps = {
    entity,
    type,
    initialValues: { name: null, type: VARIABLE_TYPE },
  };

  const handleCreatedNewVariable = (id, { field }) => changeForm(form, field, id);

  const [newVariableWindowProps, openNewVariableWindow] = useNewVariableWindowState(
    newVariableWindowInitialProps,
    handleCreatedNewVariable,
  );
  const handleNewVariable = (name) => {
    openNewVariableWindow(
      { initialValues: { name, type: VARIABLE_TYPE } },
      { field: 'variable' },
    );
  };

  const geoVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === VARIABLE_TYPE);

  return (
    <>
      <PromptText />
      <Section title="Selection Variable">
        <Row>
          <ValidatedField
            name="variable"
            component={VariablePicker}
            type={type}
            entity={entity}
            options={geoVariableOptions}
            onCreateOption={handleNewVariable}
            validation={{ required: true }}
            variable={variable}
          />
        </Row>
      </Section>
      <NewVariableWindow
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...newVariableWindowProps}
      />
    </>
  );
};
PromptFields.propTypes = {
  variableOptions: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
  })).isRequired,
  variable: PropTypes.string,
  entity: PropTypes.string,
  type: PropTypes.string,
  changeForm: PropTypes.func,
  form: PropTypes.string.isRequired,
};

PromptFields.defaultProps = {
  variable: '',
  entity: '',
  type: '',
  changeForm: () => {},
};

export default compose(
  withVariableOptions,
  withVariableHandlers,
)(PromptFields);
