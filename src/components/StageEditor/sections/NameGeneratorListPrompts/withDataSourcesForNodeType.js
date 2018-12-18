import { connect } from 'react-redux';
import { makeGetDataSourcesWithNodeType } from './selectors';
/**
 * Provides `dataSources` (options) prop
 */
const makeMapStateToProps = () => {
  const getDataSourcesWithNodeType = makeGetDataSourcesWithNodeType();

  const mapStateToProps = (state, props) => {
    const dataSourcesAsOptions = getDataSourcesWithNodeType(state, props)
      .map(source => ({ label: source, value: source }));

    return {
      dataSources: dataSourcesAsOptions,
    };
  };

  return mapStateToProps;
};

const withDataSourcesForNodeType = connect(makeMapStateToProps);

export default withDataSourcesForNodeType;
