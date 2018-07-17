import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const Draft = WrappedComponent =>
  class extends Component {
    static displayName = `Draft(${getDisplayName(WrappedComponent)})`;

    static propTypes = {
      draft: PropTypes.any,
    };

    static defaultProps = {
      draft: null,
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

    updateDraft = (value, replace = false) => {
      this.setState(
        (state) => {
          const draft = replace ?
            { ...value } :
            { ...state.draft, ...value };

          return { draft };
        },
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
          setDraft={this.setDraft}
        />
      );
    }
  };

export default Draft;
