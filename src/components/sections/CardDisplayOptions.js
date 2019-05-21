import React from 'react';
import { compose } from 'recompose';
import * as Fields from '../../ui/components/Fields';
import withDisabledAssetRequired from '../enhancers/withDisabledAssetRequired';
import MultiSelect from '../Form/MultiSelect';
import Section from './Section';
import Row from './Row';
import withMapFormToProps from '../enhancers/withMapFormToProps';
import withExternalData from '../enhancers/withExternalData';
import withExternalDataPropertyOptions from './SortOptionsForExternalData/withExternalDataPropertyOptions';

const CardDisplayOptions = ({
  maxAdditionalDisplayProperties,
  additionalPropertiesOptionGetter,
  ...props
}) => (
  <Section group contentId="guidance.editor.cardDisplayOptions" {...props}>
    <Row>
      <h3>Card Display Options</h3>
      <p>
        This section controls how the cards (which represent each item in your roster
        data file) are displayed to the participant.
      </p>
      <p>
        Cards will use the <strong>name</strong> attribute from your external data as
        the main card title.
      </p>
    </Row>
    <Row>
      <h4>Additional Display Properties</h4>
      <p>
        Would you like to display any other attributes to help the participant recognize
        a roster alter?
      </p>
      { maxAdditionalDisplayProperties === 0 &&
        <p><em>
          Your external data does not seem to contain any usable attributes.
          Is it correctly formatted?
        </em></p>
      }
      { maxAdditionalDisplayProperties > 0 &&
        <MultiSelect
          name="cardOptions.additionalProperties"
          maxItems={maxAdditionalDisplayProperties}
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
          options={additionalPropertiesOptionGetter}
        />
      }
    </Row>
  </Section>
);

export { CardDisplayOptions };

export default compose(
  withMapFormToProps('dataSource'),
  withDisabledAssetRequired,
  withExternalData,
  withExternalDataPropertyOptions,
)(CardDisplayOptions);

