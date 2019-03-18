import { get, map } from 'lodash';
import { connect } from 'react-redux';
import { getCodebook } from '../../../../selectors/protocol';

const asOptions = variables =>
  map(
    variables,
    (variable, id) => ({ label: variable.name, value: id, color: variable.color }),
  );

const mapStateToProps = (state, { nodeType }) => {
  const codebook = getCodebook(state);

  const externalDataVariables = get(codebook, ['node', nodeType, 'variables'], {});

  const externalDataPropertyOptions = asOptions(externalDataVariables);

  return {
    externalDataPropertyOptions,
  };
};

const withExternalDataPropertyOptions = connect(
  mapStateToProps,
);

export default withExternalDataPropertyOptions;
