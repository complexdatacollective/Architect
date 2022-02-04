import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '@app/utils/issues';
import { ValidatedField } from '@components/Form';
import ColorPicker from '@components/Form/Fields/ColorPicker';
import { Section, Row } from '@components/EditorLayout';
import NewVariableWindow, { useNewVariableWindowState } from '@components/NewVariableWindow';
import Options from '@components/Options';
import Tip from '@components/Tip';
import PromptText from '@components/sections/PromptText';
import { getSortOrderOptionGetter } from '@components/sections/CategoricalBinPrompts/optionGetters';
import withVariableOptions from '@components/sections/CategoricalBinPrompts/withVariableOptions';
import withVariableHandlers from '@components/sections/CategoricalBinPrompts/withVariableHandlers';
import VariablePicker from '../../Form/Fields/VariablePicker/VariablePicker';
import BucketSortOrderSection from '../BucketSortOrderSection';
import BinSortOrderSection from '../BinSortOrderSection';

const PromptFields = ({
  changeForm,
  entity,
  form,
  type,
  variable,
  variableOptions,
  optionsForVariableDraft,
}) => {
  const newVariableWindowInitialProps = {
    entity,
    type,
    initialValues: { name: null, type: null },
  };

  const handleCreatedNewVariable = (id, { field }) => changeForm(form, field, id);

  const [newVariableWindowProps, openNewVariableWindow] = useNewVariableWindowState(
    newVariableWindowInitialProps,
    handleCreatedNewVariable,
  );

  const handleNewVariable = (name) => openNewVariableWindow({ initialValues: { name, type: 'ordinal' } }, { field: 'variable' });

  const ordinalVariableOptions = variableOptions
    .filter(({ type: variableType }) => variableType === 'ordinal');

  const sortMaxItems = getSortOrderOptionGetter(variableOptions)('property').length;

  const totalOptionsLength = (optionsForVariableDraft && optionsForVariableDraft.length);

  const showVariableOptionsTip = totalOptionsLength > 5;

  return (
    <>
      <PromptText />
      <Section title="Ordinal Variable">
        <Row>
          <div id={getFieldId('variable')} />
          <ValidatedField
            name="variable"
            component={VariablePicker}
            entity={entity}
            type={type}
            options={ordinalVariableOptions}
            onCreateOption={handleNewVariable}
            validation={{ required: true }}
            variable={variable}
          />
        </Row>
      </Section>
      { variable
        && (
        <Section
          title="Variable Options"
          summary={(
            <p>
              Create
              { ' ' }
              <strong>up to 5</strong>
              {' '}
              options for this variable.
            </p>
          )}
        >
          <Row>
            <div id={getFieldId('variableOptions')} />
            { showVariableOptionsTip
            && (
            <Tip type="error">
              <p>
                The ordinal bin interface is designed to use
                {' '}
                <strong>
                  up to 5 option
                  values
                  {' '}
                </strong>
                . Using more will create
                a sub-optimal experience for participants, and might reduce data quality.
              </p>
            </Tip>
            )}
            <Options
              name="variableOptions"
              label="Options"
            />
          </Row>
        </Section>
        )}
      <Section
        title="Color"
        summary={(
          <p>
            Interviewer will render each option in your ordinal variable using a
            color gradient.
          </p>
        )}
      >
        <Row>
          <div id={getFieldId('color')} data-name="Gradient color" />
          <ValidatedField
            label="Which color would you like to use for this scale?"
            component={ColorPicker}
            name="color"
            palette="ord-color-seq"
            paletteRange={8}
            validation={{ required: true }}
          />
        </Row>
      </Section>
      <BucketSortOrderSection
        form={form}
        disabled={!variable}
        maxItems={sortMaxItems}
        optionGetter={getSortOrderOptionGetter(variableOptions)}
      />
      <BinSortOrderSection
        form={form}
        disabled={!variable}
        maxItems={sortMaxItems}
        optionGetter={getSortOrderOptionGetter(variableOptions)}
      />
      <NewVariableWindow
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...newVariableWindowProps}
      />
    </>
  );
};

PromptFields.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variableOptions: PropTypes.array,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  changeForm: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  variable: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  optionsForVariableDraft: PropTypes.array,
};

PromptFields.defaultProps = {
  variableOptions: [],
  variable: null,
  optionsForVariableDraft: [],
};

export default compose(
  withVariableOptions,
  withVariableHandlers,
)(PromptFields);
