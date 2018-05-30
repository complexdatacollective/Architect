import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isNull } from 'lodash';

class Guidance extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    activeOption: PropTypes.number,
    children: PropTypes.node,
  };

  static defaultProps = {
    options: [],
    activeOption: null,
    children: null,
  }

  renderGuidance = ({ guidance }, index) => {
    const guidanceClasses = cx(
      'timeline-insert-stage__guidance-item',
      {
        'timeline-insert-stage__guidance-item--is-active': this.props.activeOption === index,
      },
    );

    return (
      <div className={guidanceClasses} key={index}>
        <h3>{ guidance.title }</h3>
        { guidance.description }
      </div>
    );
  };

  render() {
    const {
      activeOption,
      options,
      children,
    } = this.props;

    const guidanceClasses = cx(
      'timeline-insert-stage__guidance',
      {
        'timeline-insert-stage__guidance--is-active': !isNull(activeOption),
      },
    );

    return (
      <div className={guidanceClasses}>
        <div className="timeline-insert-stage__guidance-introduction">
          { children }
        </div>
        {options.map(this.renderGuidance)}
      </div>
    );
  }
}

export { Guidance };

export default Guidance;
