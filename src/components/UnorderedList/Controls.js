import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import SortControl from './SortControl';

class Controls extends Component {
  constructor(props) {
    super(props);

    const { initialSortOrder } = this.props;
    this.state = {
      query: '',
      sortOrder: initialSortOrder,
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
    const { onChange } = this.props;
    onChange(parameter);
  }

  render() {
    const {
      query,
      sortOrder,
    } = this.state;

    const {
      sortableProperties,
    } = this.props;

    return (
      <div className="list-controls">
        <div className="list-controls__section list-controls__section--search">
          <div className="list-controls__section-name">
            Filter:
          </div>
          <TextField
            input={{
              value: query,
              onChange: this.handleUpdateQuery,
            }}
          />
        </div>
        { sortableProperties.length > 0
          && (
          <div className="list-controls__section">
            <div className="list-controls__section-name">
              Sort by:
            </div>
            <SortControl
              sortableProperties={sortableProperties}
              sortOrder={sortOrder}
              onChange={this.handleUpdateSortOrder}
            />
          </div>
          )}
      </div>
    );
  }
}

Controls.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  sortableProperties: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  initialSortOrder: PropTypes.object,
};

Controls.defaultProps = {
  onChange: () => {},
  sortableProperties: [],
  initialSortOrder: {},
};

export default Controls;
