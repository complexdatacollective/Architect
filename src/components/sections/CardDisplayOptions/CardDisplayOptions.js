import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { useDispatch, useSelector } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { Section, Row } from '@components/EditorLayout';
import withDisabledAssetRequired from '@components/enhancers/withDisabledAssetRequired';
import withMapFormToProps from '@components/enhancers/withMapFormToProps';
import useVariablesFromExternalData from '@hooks/useVariablesFromExternalData';
import MultiSelect from '@components/Form/MultiSelect';
import getVariableOptionsGetter from '../SortOptionsForExternalData/getVariableOptionsGetter';
import Tip from '../../Tip';

const CardDisplayOptions = ({
  dataSource,
  disabled,
}) => {
  const { variables: variableOptions } = useVariablesFromExternalData(dataSource, true);
  const variableOptionsGetter = getVariableOptionsGetter(variableOptions);
  const maxVariableOptions = variableOptions.length;

  const dispatch = useDispatch();
  const getFormValue = formValueSelector('edit-stage');
  const hasCardDisplayOptions = useSelector((state) => getFormValue(state, 'cardOptions.additionalProperties'));

  const handleToggleCardDisplayOptions = (nextState) => {
    if (nextState === false) {
      dispatch(change('edit-stage', 'cardOptions.additionalProperties', null));
    }

    return true;
  };

  return (
    <Section
      title="Card Display Options"
      summary={(
        <p>
          This section controls how the cards (which represent each item in your roster
          data file) are displayed to the participant.
        </p>
      )}
      toggleable
      startExpanded={!!hasCardDisplayOptions}
      handleToggleChange={handleToggleCardDisplayOptions}
      disabled={disabled}
    >
      <Row>
        <Tip>
          <p>
            Cards will use the
            {' '}
            <strong>name</strong>
            {' '}
            attribute from your external data as
            the main card title.
          </p>
        </Tip>
      </Row>
      <Row>
        <h4>Additional Display Properties</h4>
        <p>
          Would you like to display any other attributes to help the participant recognize
          a roster alter?
        </p>
        { maxVariableOptions === 0
          && (
          <p>
            <em>
              Your external data does not seem to contain any usable attributes.
              Is it correctly formatted?
            </em>
          </p>
          )}
        { maxVariableOptions > 0
          && (
          <MultiSelect
            name="cardOptions.additionalProperties"
            maxItems={maxVariableOptions}
            properties={[
              {
                fieldName: 'variable',
              },
              {
                fieldName: 'label',
                component: Fields.Text,
                placeholder: 'Label',
              },
            ]}
            options={variableOptionsGetter}
          />
          )}
      </Row>
    </Section>
  );
};

CardDisplayOptions.propTypes = {
  dataSource: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export { CardDisplayOptions };

export default compose(
  withMapFormToProps('dataSource'),
  withDisabledAssetRequired,
)(CardDisplayOptions);
