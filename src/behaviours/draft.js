import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

export default function (WrappedComponent) {
  return class draft extends Component {
    static propTypes = {
      draft: PropTypes.any.isRequired,
    };

    constructor(props) {
      super(props);

      this.state = { draft: null };
    }

    componentDidMount() {
      this.loadDraftFromProps(this.props);
    }

    componentWillReceiveProps(props) {
      this.loadDraftFromProps(props);
    }

    updateDraft = (value) => {
      this.setState(
        state => ({
          draft: {
            ...state.draft,
            ...value,
          },
        }),
      );
    };

    hasChanges() {
      return !isEqual(this.state.draft, this.props.draft);
    }

    loadDraftFromProps(props) {
      if (props.draft === null) { return; } // Keep state visble in transitions

      this.setState({
        draft: props.draft,
      });
    }

    render() {
      if (this.state.draft === null) { return null; }

      return (
        <WrappedComponent
          {...this.props}
          draft={this.state.draft}
          hasChanges={this.hasChanges()}
          updateDraft={this.updateDraft}
        />
      );
    }
  };
}
