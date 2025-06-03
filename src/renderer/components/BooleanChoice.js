import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isNull } from 'lodash';
import { Field, formValueSelector, change } from 'redux-form';
import RichText from '@codaco/ui/lib/components/Fields/RichText';
import Toggle from '@codaco/ui/lib/components/Fields/Toggle';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ValidatedField from './Form/ValidatedField';

const mapStateToProps = (state, { form }) => {
  const selector = formValueSelector(form);

  const formSelector = (variable) => selector(state, variable);
  return {
    formSelector,
  };
};

const mapDispatchToProps = {
  changeField: change,
};

const Options = compose(
  connect(mapStateToProps, mapDispatchToProps),
)(({
  form,
  formSelector,
  changeField,
}) => {
  const initialValues = [
    { label: 'Yes', value: true },
    { label: 'No', value: false, negative: true },
  ];

  useEffect(() => {
    const currentOptions = formSelector('options');
    if (isNull(currentOptions) || isEmpty(currentOptions)) {
      changeField(form, 'options', initialValues);
    }
  }, []);

  return (
    <div className="type-editor__subsection">
      <p>
        The BooleanChoice input component allows you to specify rich text
        labels for the two choices that your participant sees. Create a
        label for the first option, representing the value true, and the
        second option, representing the value false, below.
      </p>
      <p>
        Each value can also be styled to indicate
        that it is negative. When enabled, this will make the option red
        when selected, and use a cross icon rather than a tick.
      </p>
      <div className="boolean-option-configuration">
        <div className="boolean-option-configuration__item">
          <h3>Option One</h3>
          <p>
            This option will set the value
            { ' ' }
            <strong>true</strong>
            { ' ' }
            when selected.
          </p>
          <ValidatedField
            label="Label"
            component={RichText}
            name="options[0].label"
            validation={{ required: true }}
            disallowedTypes={['history', 'quote']}
          />
          <Field
            label="Style option as negative"
            component={Toggle}
            name="options[0].negative"
          />
        </div>
        <div className="boolean-option-configuration__item">
          <h3>Option Two</h3>
          <p>
            This option will set the value
            { ' ' }
            <strong>false</strong>
            { ' ' }
            when selected.
          </p>
          <ValidatedField
            label="Label"
            component={RichText}
            name="options[1].label"
            validation={{ required: true }}
            disallowedTypes={['history', 'quote']}
          />
          <Field
            label="Style option as negative"
            component={Toggle}
            name="options[1].negative"
          />
        </div>
      </div>
    </div>
  );
});

Options.propTypes = {
  form: PropTypes.string.isRequired,
  formSelector: PropTypes.func.isRequired,
  changeField: PropTypes.func.isRequired,
};

export default Options;
