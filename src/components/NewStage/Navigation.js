import React from 'react';
import PropTypes from 'prop-types';
import changeCase from 'change-case';
import scrollTo from '../../utils/scrollTo';

const scrollToCategory = (category) => {
  const categoryId = changeCase.param(category);
  const target = document.getElementById(`new-stage-${categoryId}`);

  if (!target) { return; }

  scrollTo(target, -100);
};

const Navigation = ({
  categories,
}) => (
  <div className="new-stage-navigation">
    {categories.map((category) => (
      <div
        className={`new-stage-navigation__category new-stage-navigation__category--${changeCase.param(category)}`}
        onClick={() => scrollToCategory(category)}
        key={category}
      >
        { category }
      </div>
    ))}
  </div>
);

Navigation.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  categories: PropTypes.array,
};

Navigation.defaultProps = {
  categories: [],
};

export default Navigation;
