import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form, fields }) => {
  const items = formValueSelector(form)(state, fields.name) || [];
  const itemCount = items ? items.length : 0;

  return {
    itemCount,
    items,
  };
};

const withItems = connect(
  mapStateToProps,
);

export default withItems;
