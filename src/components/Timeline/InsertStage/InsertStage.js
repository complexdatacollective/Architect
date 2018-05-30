import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { sortBy, compose } from 'lodash/fp';
import OptionsGrid from './OptionsGrid';
import Guidance from './Guidance';
import Filter from './Filter';
import interfaceOptions from './interfaceOptions';

const sortByType = sortBy(['type']);

const filterByType = query =>
  items =>
    items.filter(item => (query === '' || item.type.toLowerCase().indexOf(query.toLowerCase()) !== -1));

const sortDirection = order =>
  items =>
    (order === 'Z-A' ? items.reverse() : items);

const filter = (query, order) =>
  compose(
    filterByType(query),
    sortDirection(order),
    sortByType,
  );

class InsertStage extends PureComponent {
  static propTypes = {
    onSelectStageType: PropTypes.func,
  };

  static defaultProps = {
    onSelectStageType: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      activeOption: null,
      query: '',
      order: null,
    };
  }

  get filteredOptions() {
    const { query, order } = this.state;

    return filter(query, order)(interfaceOptions);
  }

  handleOptionActive = (index) => {
    this.setState({ activeOption: index });
  };

  handleOptionInactive = () => {
    this.setState({ activeOption: null });
  };

  render() {
    const {
      query,
      order,
      activeOption,
    } = this.state;

    return (
      <div className="timeline-insert-stage">
        <div className="timeline-insert-stage__chooser">
          <div className="timeline-insert-stage__chooser-controls">
            <Filter
              order={order}
              query={query}
              handleChange={state => this.setState(state)}
            />
          </div>
          <div className="timeline-insert-stage__chooser-options">
            <OptionsGrid
              options={this.filteredOptions}
              handleOptionSelected={type => this.props.onSelectStageType(type)}
              handleOptionActive={index => this.handleOptionActive(index)}
              handleOptionInactive={() => this.handleOptionInactive()}
            />
          </div>
        </div>
        <Guidance
          options={interfaceOptions}
          activeOption={activeOption}
        >
          <h3>Add a new stage to your interview</h3>
          <p>
            {'Each card on the left represents an "interface" that you can add to your interview as a stage. An interface is a screen that has been designed to collect a specific type of data.'}
          </p>
          <p>
            {'Hover over the cards to see more information about them, and learn which data they are designed to collect.'}
          </p>
        </Guidance>
      </div>
    );
  }
}

export { InsertStage };

export default InsertStage;
