import React from 'react';
import changeCase from 'change-case';
import Interface from './Interface';

const InterfaceCategory = ({
  interfaces,
  category,
  onSelect,
}) => {
  const categoryId = changeCase.param(category);

  return (
    <div
      id={`new-stage-${categoryId}`}
      className={`new-stage-interface-category new-stage-interface-category--${categoryId}`}
    >
      <h2 className="new-stage-interface-category__title">{ category }</h2>

      <div className="new-stage-interface-category__interfaces">
        {interfaces.map((props, index) => (
          <div className="new-stage-interface-category__interface" key={index}>
            <Interface
              {...props}
              onSelect={onSelect}
              tags={[category]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterfaceCategory;
