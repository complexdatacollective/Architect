import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import MultiSelect from '@components/Form/MultiSelect';
import { Section, Row } from '@components/EditorLayout';
import Tip from '@components/Tip';

const BucketSortOrderSection = ({
  form,
  disabled,
  maxItems,
  optionGetter,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const hasBucketSortOrder = useSelector((state) => getFormValue(state, 'bucketSortOrder'));

  const handleToggleChange = (nextState) => {
    if (nextState === false) {
      dispatch(change(form, 'bucketSortOrder', null));
    }

    return true;
  };

  return (
    <Section
      title="Bucket Sort Order"
      summary={(
        <p>
          Nodes are stacked in the bucket before they are placed by the participant. You may
          optionally configure a list of rules to determine how nodes are sorted in the bucket
          when the task starts, which will determine the order that your participant places them
          into bins. Interviewer will default to using the order in which nodes were named.
        </p>
      )}
      toggleable
      disabled={disabled}
      startExpanded={!!hasBucketSortOrder}
      handleToggleChange={handleToggleChange}
    >
      <Row>
        <Tip>
          <p>
            Use the asterisk property to sort by the order that nodes were created.
          </p>
        </Tip>
        <MultiSelect
          name="bucketSortOrder"
          properties={[
            { fieldName: 'property' },
            { fieldName: 'direction' },
          ]}
          maxItems={maxItems}
          options={optionGetter}
        />
      </Row>
    </Section>
  );
};

BucketSortOrderSection.propTypes = {
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  maxItems: PropTypes.number,
  optionGetter: PropTypes.func.isRequired,
};

BucketSortOrderSection.defaultProps = {
  disabled: false,
  maxItems: 5,
};

export default BucketSortOrderSection;
