import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../../utils/issues';
import { ValidatedField } from '../../../Form';
import Select from '../../../Form/Fields/Select';
import { TextArea } from '../../../../ui/components/Fields';
import MultiSelect from '../../../Form/MultiSelect';
import { Row } from '../../../OrderedList';
import { getSortOrderOptionGetter } from './optionGetters';
import withVariableOptions from './withVariableOptions';

class PromptFields extends PureComponent {
  render() {
    const {
      variableOptions,
    } = this.props;

    const categoricalVariableOptions = variableOptions
      .filter(({ type }) => type === 'categorical');

    return (
      <React.Fragment>
        <Row>
          <h3 id={getFieldId('text')}>Text for Prompt</h3>
          <ValidatedField
            name={'text'}
            component={TextArea}
            label=""
            placeholder="Enter text for the prompt here"
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <div id={getFieldId('variable')} data-name="Variable" />
          <ValidatedField
            name={'variable'}
            component={Select}
            label=""
            options={categoricalVariableOptions}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3>Bin Sort Order</h3>
          <p>How would you like to sort the node categories?</p>
          <MultiSelect
            name={'binSortOrder'}
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            options={getSortOrderOptionGetter(variableOptions)}
          />
        </Row>
        <Row>
          <h3>Bucket Sort Order</h3>
          <p>How would you like to sort the unplaced nodes?</p>
          <MultiSelect
            name={'bucketSortOrder'}
            properties={[
              { fieldName: 'property' },
              { fieldName: 'direction' },
            ]}
            options={getSortOrderOptionGetter(variableOptions)}
          />
        </Row>
      </React.Fragment>
    );
  }
}

PromptFields.propTypes = {
  variableOptions: PropTypes.array,
};

PromptFields.defaultProps = {
  variableOptions: [],
};

export { PromptFields };

export default compose(
  withVariableOptions,
)(PromptFields);
