import React from 'react';
import changeCase from 'change-case';
import scrollTo from '../../utils/scrollTo';

const scrollToCategory = (category) => {
  const categoryId = changeCase.param(category);
  const target = document.getElementById(`new-stage-${categoryId}`);

  console.log({ category, categoryId, target });

  if (!target) { return; }

  scrollTo(target, -100);
};

const Navigation = ({ categories }) => (
  <div className="new-stage-navigation">
    {categories.map((category, index) => (
      <div
        className={`new-stage-navigation__category new-stage-navigation__category--${changeCase.param(category)}`}
        onClick={() => scrollToCategory(category)}
        key={index}
      >
        { category }
      </div>
    ))}
  </div>
);

export default Navigation;
