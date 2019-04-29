import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

const mapStateToProps = (state, { form }) => {
  const type = formValueSelector(form)(state, 'type');

  return {
    type,
  };
};

const withItemMeta = connect(
  mapStateToProps,
);

export default withItemMeta;
