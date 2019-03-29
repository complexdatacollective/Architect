import { connect } from 'react-redux';
import { get } from 'lodash';
import { change, formValueSelector } from 'redux-form';
import { lifecycle, compose } from 'recompose';
import { getCodebook } from '../../../selectors/protocol';

const mapStateToProps = (state, { form, nodeType }) => {
  const codebook = getCodebook(state);
  const displayVariable = get(codebook, ['node', nodeType, 'displayVariable']);
  const quickAdd = formValueSelector(form)(state, 'quickAdd');

  return {
    quickAdd,
    displayVariable,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  change: (field, value) => dispatch(change(form, field, value)),
});

const withAutoSetDefault = lifecycle({
  componentDidUpdate() {
    const { quickAdd, displayVariable } = this.props;

    if (!quickAdd && displayVariable) {
      this.props.change('quickAdd', displayVariable);
    }
  },
});

const withDefaultToDisplayVariable = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAutoSetDefault,
);

export default withDefaultToDisplayVariable;
