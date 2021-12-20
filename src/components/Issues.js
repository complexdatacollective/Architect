import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { getFormSyncErrors } from 'redux-form';
import { map, isEmpty } from 'lodash';
import { Icon } from '@codaco/ui';
import { flattenIssues, getFieldId } from '../utils/issues';
import scrollTo from '../utils/scrollTo';

const Issues = ({
  show,
  form,
  hideIssues,
}) => {
  const issues = useSelector(getFormSyncErrors(form));
  const [open, setOpen] = useState(true);
  const flatIssues = flattenIssues(issues);
  const issueRefs = useRef({});

  const hasOutstandingIssues = Object.keys(issues).length !== 0;

  useEffect(() => {
    if (!hasOutstandingIssues) {
      hideIssues();
    }
  }, [hasOutstandingIssues]);

  const setIssueRef = (el, fieldId) => {
    issueRefs.current[fieldId] = el;
  };

  /**
   * Because display information for fields is essentially stored in the dom
   * we use that as our data source for the field labels in the issue list.
   */
  const updateFieldNames = () => {
    // for each issue get friendly title from dom
    flatIssues.forEach(({ field }) => {
      const fieldId = getFieldId(field);

      const targetField = document.querySelector(`#${fieldId}`);

      if (!targetField) { return; }

      const fieldName = targetField.getAttribute('data-name') || targetField.textContent;

      if (fieldName) {
        issueRefs.current[fieldId].textContent = fieldName;
      }
    });
  };

  useEffect(() => {
    updateFieldNames();
  });

  // when panel hidden by parent reset collapsed state
  const noIssues = isEmpty(issues);
  useEffect(() => {
    if (noIssues || !show) { setOpen(true); }
  }, [show, noIssues]);

  const handleClickTitleBar = () => setOpen((toggle) => !toggle);

  const handleClickIssue = (e) => {
    e.preventDefault();

    const link = e.target.closest('a').getAttribute('href');
    const destination = document.querySelector(link);
    scrollTo(destination);
  };

  const renderedIssues = map(
    flatIssues,
    ({ field, issue }) => {
      const fieldId = getFieldId(field);

      return (
        <li
          key={fieldId}
          className="issues__issue"
        >
          <a
            href={`#${fieldId}`}
            onClick={handleClickIssue}
          >
            <span ref={(el) => setIssueRef(el, fieldId)}>
              {field}
            </span>
            {' '}
            -
            {' '}
            {issue}
          </a>
        </li>
      );
    },
  );

  const isVisible = show && flatIssues.length > 0;

  const issuesClasses = cx(
    'issues',
    {
      'issues--show': isVisible,
      'issues--open': open,
    },
  );

  return (
    <div className={issuesClasses}>
      <div className="issues__panel">
        <div className="issues__title-bar" onClick={handleClickTitleBar}>
          <div className="issues__title-bar-icon">
            <Icon name="info" color="white" />
          </div>
          <div className="issues__title-bar-text">
            Issues (
            {flatIssues.length}
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
          {renderedIssues}
        </ol>
      </div>
    </div>
  );
};

Issues.propTypes = {
  show: PropTypes.bool,
  form: PropTypes.string.isRequired,
  hideIssues: PropTypes.func.isRequired,
};

Issues.defaultProps = {
  show: true,
};

export default Issues;
