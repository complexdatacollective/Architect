import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Section from './Section';
import Guidance from './Guidance';

class Guided extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    sections: PropTypes.object,
    defaultGuidance: PropTypes.node,
  };

  static defaultProps = {
    children: null,
    className: '',
    sections: {},
    defaultGuidance: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      active: null,
      guided: true,
    };
  }

  getGuidance = () =>
    get(
      this.props.sections,
      [this.state.active, 'Guidance'],
      this.props.defaultGuidance,
    );

  showGuidance = (index) => {
    this.setState({ active: index });
  };

  toggleGuidance = () => {
    this.setState({ guided: !this.state.guided });
  }

  resetGuidance = () => {
    this.setState({ active: null });
  };

  renderSections = () => {
    const {
      sections,
      className,
      defaultGuidance,
      ...rest
    } = this.props;

    return sections
      .map((SectionComponent, index) => {
        const isActive = this.state.active === index;

        return (
          <Section
            key={index}
            isActive={isActive}
            handleMouseEnter={() => this.showGuidance(index)}
            handleMouseLeave={this.resetGuidance}
          >
            <SectionComponent {...rest} />
          </Section>
        );
      });
  };

  render() {
    const classNames = cx(
      this.props.className,
      'guided',
      { 'guided--show-guidance': this.state.guided },
    );

    return (
      <div className={classNames}>
        <div className="guided__content">
          { this.props.children }

          <div className="guided__sections">
            { this.renderSections() }
          </div>
        </div>

        <Guidance
          show={this.state.guided}
          guidance={this.getGuidance()}
          handleClickToggle={this.toggleGuidance}
        />
      </div>
    );
  }
}

export default Guided;
