import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import { get } from 'lodash';
import WipeTransition from '../Transitions/Wipe';

const Items = ({ fields, meta: { error }, itemComponent: ItemComponent, ...rest }) => (
  <div className="items">
    { error && <p className="items__error">{error}</p> }
    <TransitionGroup className="items__items">
      { fields.map((fieldId, index) => (
        <WipeTransition key={get(fields.get(index), 'id', index)}>
          <div className="items__item">
            <ItemComponent
              fieldId={fieldId}
              index={index}
              fields={fields}
              handleDelete={() => { fields.remove(index); }}
              {...rest}
            />
          </div>
        </WipeTransition>
      )) }
    </TransitionGroup>
  </div>
);

Items.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  itemComponent: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

Items.defaultProps = {
  getId: fieldId => fieldId,
};

export { Items };

export default Items;
