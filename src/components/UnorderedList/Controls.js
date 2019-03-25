import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '../../ui/components/Fields/Text';
import SortControl from './SortControl';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      sortOrder: this.props.initialSortOrder,
    };
  }

  handleUpdateQuery = (event) => {
    const query = event.target.value;

    this.updateParameter({ query });
  }

  handleUpdateSortOrder = (sortOrder) => {
    this.updateParameter({ sortOrder });
  }

  updateParameter(parameter) {
    this.setState(parameter);
    this.props.onChange(parameter);
  }

  render() {
    return (
      <div className="list-controls">
        <div className="list-controls__section list-controls__section--search">
          <div className="list-controls__section-name">
            Filter:
          </div>
          <TextField
            input={{
              value: this.state.query,
              onChange: this.handleUpdateQuery,
            }}
          />
        </div>
        { this.props.sortableProperties.length > 0 &&
          <div className="list-controls__section">
            <div className="list-controls__section-name">
              Sort by:
            </div>
            <SortControl
              sortableProperties={this.props.sortableProperties}
              sortOrder={this.state.sortOrder}
              onChange={this.handleUpdateSortOrder}
            />
          </div>
        }
      </div>
    );
  }
}

Controls.propTypes = {
  onChange: PropTypes.func,
  sortableProperties: PropTypes.array,
  initialSortOrder: PropTypes.object,
};

Controls.defaultProps = {
  onChange: () => {},
  sortableProperties: [],
  initialSortOrder: {},
};

export default Controls;
