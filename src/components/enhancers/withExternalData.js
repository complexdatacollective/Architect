import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { getAssetPath, getExternalData } from '../../selectors/externalData';

const mapStateToProps = (state, props) => {
  if (!props.dataSource) { return {}; }

  const assetPath = getAssetPath(state, props.dataSource);

  return { assetPath };
};

const withExternalData = WrappedComponent =>
  class WithExternalData extends Component {
    static propTypes = {
      assetPath: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        externalData: null,
        error: null,
      };
    }

    componentDidMount() {
      this.fetchExternalData();
    }

    componentDidUpdate(prevProps) {
      if (this.props.assetPath !== prevProps.assetPath) {
        this.fetchExternalData();
      }
    }

    async fetchExternalData() {
      if (!this.props.assetPath) { return; }

      this.setState({ loading: true, externalData: null, error: null });

      try {
        const externalData = await getExternalData(this.props.assetPath);
        this.setState({ loading: false, externalData });
      } catch (e) {
        this.setState({ loading: false, error: e.toString() });
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
        />
      );
    }
  };

export { withExternalData };

export default compose(
  connect(mapStateToProps),
  withExternalData,
);
