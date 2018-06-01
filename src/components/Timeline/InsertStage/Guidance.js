import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isNull } from 'lodash';

class Guidance extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    activeOption: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    options: [],
    activeOption: null,
    children: null,
  }

  renderGuidance = ({ guidance, type }) => {
    const guidanceClasses = cx(
      'timeline-insert-stage-guidance__item',
      {
        'timeline-insert-stage-guidance__item--is-active': this.props.activeOption === type,
      },
    );

    return (
      <div className={guidanceClasses} key={type}>
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
      'timeline-insert-stage-guidance',
      {
        'timeline-insert-stage-guidance--is-active': !isNull(activeOption),
      },
    );

    return (
      <div className={guidanceClasses}>
        <div className="timeline-insert-stage-guidance__introduction">
          { children }
        </div>
        {options.map(this.renderGuidance)}
      </div>
    );
  }
}

export { Guidance };

export default Guidance;
