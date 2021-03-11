import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { map, isEmpty } from 'lodash';
import { Icon } from '@codaco/ui';
import { flattenIssues, getFieldId } from '../utils/issues';
import scrollTo from '../utils/scrollTo';

class Issues extends Component {
  static propTypes = {
    show: PropTypes.bool,
    issues: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    show: true,
    issues: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };

    this.flatIssues = flattenIssues(props.issues);
    this.issueRefs = {};
  }

  componentDidMount() {
    this.updateFieldNames();
  }

  componentWillReceiveProps(newProps) {
    const noIssues = isEmpty(newProps.issues);
    const { show } = newProps;

    this.flatIssues = flattenIssues(newProps.issues);

    // when panel hidden by parent reset collapsed state
    if (noIssues || !show) { this.setState({ open: true }); }
  }

  componentDidUpdate() {
    this.updateFieldNames();
  }

  setIssueRef = (el, fieldId) => {
    this.issueRefs[fieldId] = el;
  }

  /**
   * Because display information for fields is essentially stored in the dom
   * we use that as our data source for the field labels in the issue list.
   */
  updateFieldNames() {
    // for each issue get friendly title from dom
    this.flatIssues.forEach(({ field }) => {
      const fieldId = getFieldId(field);

      const targetField = document.querySelector(`#${fieldId}`);

      if (!targetField) { return; }

      const fieldName = targetField.getAttribute('data-name') || targetField.textContent;

      if (fieldName) {
        this.issueRefs[fieldId].textContent = fieldName;
      }
    });
  }

  isVisible = () => this.props.show && this.flatIssues.length > 0;

  isOpen = () => this.state.open;

  handleClickTitleBar = () => this.setState({ open: !this.state.open });

  handleClickIssue = (e) => {
    e.preventDefault();

    const link = e.target.closest('a').getAttribute('href');
    const destination = document.querySelector(link);
    scrollTo(destination);
  }

  render() {
    const issues = map(
      this.flatIssues,
      ({ field, issue }) => {
        const fieldId = getFieldId(field);

        return (
          <li
            key={fieldId}
            className="issues__issue"
          >
            <a
              href={`#${fieldId}`}
              onClick={this.handleClickIssue}
            >
              <span ref={(el) => this.setIssueRef(el, fieldId)}>
                {field}
              </span>
              {' '}
              -
              {issue}
            </a>
          </li>
        );
      },
    );

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
            <div className="issues__title-bar-icon">
              <Icon name="info" color="white" />
            </div>
            <div className="issues__title-bar-text">
              Issues (
              {this.flatIssues.length}
              )
            </div>
            <div className="issues__title-bar-toggle">
              <Icon
                name="chevron-down"
                color="white"
                className="issues__toggle--open"
              />
              <Icon
                name="chevron-up"
                color="white"
                className="issues__toggle--close"
              />
            </div>
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
