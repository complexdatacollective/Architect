import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import MultiSelect from '@components/Form/MultiSelect';
import { Section, Row } from '@components/EditorLayout';

const BinSortOrderSection = ({
  form,
  disabled,
  maxItems,
  optionGetter,
}) => {
  const dispatch = useDispatch();
  const getFormValue = formValueSelector(form);
  const hasBinSortOrder = useSelector((state) => getFormValue(state, 'binSortOrder'));

  const handleToggleChange = (nextState) => {
    if (nextState === false) {
      dispatch(change(form, 'binSortOrder', null));
    }

    return true;
  };

  return (
    <Section
      title="Bin Sort Order"
      summary={(
        <p>
          You may also configure one or more sort rules that determine the order that nodes
          are listed after they have been placed into a bin.
        </p>
      )}
      toggleable
      disabled={disabled}
      startExpanded={!!hasBinSortOrder}
      handleToggleChange={handleToggleChange}
    >
      <Row>
        <MultiSelect
          name="binSortOrder"
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

BinSortOrderSection.propTypes = {
  form: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  maxItems: PropTypes.number,
  optionGetter: PropTypes.func.isRequired,
};

BinSortOrderSection.defaultProps = {
  disabled: false,
  maxItems: 5,
};

export default BinSortOrderSection;
