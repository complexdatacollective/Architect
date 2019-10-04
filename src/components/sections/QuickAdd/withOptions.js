import { connect } from 'react-redux';
import { getVariables, asOption } from '@selectors/codebook';

const mapStateToProps = (state, { entity, type }) => {
  const variables = getVariables(state, { subject: { entity, type } })
    .filter(({ properties }) => properties.type === 'text');
  const options = variables.map(asOption());

  return {
    options,
  };
};

const withOptions = connect(mapStateToProps);

export default withOptions;
