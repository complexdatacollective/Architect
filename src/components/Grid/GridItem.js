import React from 'react';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import Icon from '@codaco/ui/lib/components/Icon';

const GridItem = ({
  fields,
  editField,
  onEditItem,
  previewComponent: PreviewComponent,
  index,
  id,
  ...rest
}) => {
  const fieldId = `${fields.name}[${index}]`;
  const flipId = editField === fieldId ? `_${fieldId}` : fieldId;

  if (!PreviewComponent) { return null; }

  return (
    <div>
      <Flipped flipId={flipId}>
        <div className="grid-item">
          <div className="grid-item__content">
            <PreviewComponent
              id={id}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
            />
          </div>
          <div className="grid-item__controls">
            <div
              className="grid-item__edit"
              onClick={() => onEditItem(fieldId)}
            >
              <Icon name="edit" />
            </div>
            <div
              className="grid-item__delete"
              onClick={() => fields.remove(index)}
            >
              <Icon name="delete" />
            </div>
          </div>

        </div>
      </Flipped>
    </div>
  );
};

GridItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.object.isRequired,
  editField: PropTypes.string,
  onEditItem: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  previewComponent: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

GridItem.defaultProps = {
  editField: null,
};

export default GridItem;
