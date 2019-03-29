import { connect } from 'react-redux';
import { get } from 'lodash';
import { change, formValueSelector } from 'redux-form';
import { lifecycle, compose, withHandlers } from 'recompose';
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

const mapDispatchToProps = { changeForm: change };

const withAutoSetDefaultState = connect(mapStateToProps, mapDispatchToProps);

const withAutoSetDefaultHandlers = withHandlers({
  autoSetDefault: ({ form, changeForm, quickAdd, displayVariable }) =>
    () => {
      if (!quickAdd && displayVariable) {
        changeForm(form, 'quickAdd', displayVariable);
      }
    },
});

const withAutoSetDefaultLifecycle = lifecycle({
  componentDidUpdate() {
    this.props.autoSetDefault();
  },
  componentDidMount() {
    this.props.autoSetDefault();
  },
});

const withDefaultToDisplayVariable = compose(
  withAutoSetDefaultState,
  withAutoSetDefaultHandlers,
  withAutoSetDefaultLifecycle,
);

export default withDefaultToDisplayVariable;
