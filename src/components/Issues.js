import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { map, size } from 'lodash';
import scrollparent from 'scrollparent';
import anime from 'animejs';
import { getCSSVariableAsObject, getCSSVariableAsNumber } from '../utils/CSSVariables';
import { flattenIssues, getFieldId } from '../utils/issues';

const scrollTo = (destination) => {
  if (!destination) { return; }
  const scroller = scrollparent(destination);
  const scrollStart = scroller.scrollTop;
  const destinationOffset = parseInt(destination.getBoundingClientRect().top, 10);
  const scrollEnd = scrollStart + destinationOffset;

  anime({
    targets: scroller,
    scrollTop: scrollEnd,
    easing: getCSSVariableAsObject('--animation-easing-js'),
    duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
  });
};

class Issues extends Component {
  static propTypes = {
    show: PropTypes.bool,
    issues: PropTypes.array,
  };

  static defaultProps = {
    show: true,
    issues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  }

  componentWillReceiveProps(newProps) {
    const noIssues = size(newProps.issues) > 0;
    const show = newProps.show;

    // when panel hidden by parent reset collapsed state
    if (noIssues || !show) { this.setState({ open: true }); }
  }

  isVisible = () =>
    this.props.show && size(this.props.issues) > 0;

  isOpen = () =>
    this.state.open;

  handleClickTitleBar = () =>
    this.setState({ open: !this.state.open });

  handleClickIssue = (e) => {
    e.preventDefault();

    const link = e.target.getAttribute('href');
    const destination = document.querySelector(link);
    scrollTo(destination);
  }

  render() {
    const flatIssues = flattenIssues(this.props.issues);

    const issues = map(
      flatIssues,
      ({ field, issue }) => (
        <li key={getFieldId(field)} className="issues__issue">
          <a
            href={`#${getFieldId(field)}`}
            onClick={this.handleClickIssue}
          >
            {field} is {issue}
          </a>
        </li>
      ));

    const issuesClasses = cx(
      'issues',
      {
        'issues--show': this.isVisible(),
        'issues--open': this.isOpen(),
      },
    );

    return (
      <div className={issuesClasses}>
        <div className="issues__panel">
          <div className="issues__title-bar" onClick={this.handleClickTitleBar}>
            Issues ({size(this.props.issues)}) {this.isOpen()} { this.isVisible() }
          </div>
          <ol className="issues__issues">
            {issues}
          </ol>
        </div>
      </div>
    );
  }
}

export { Issues };

export default Issues;
