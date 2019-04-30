import React from 'react';
import { Flipped } from 'react-flip-toolkit';
import Icon from '../../ui/components/Icon';

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
            <PreviewComponent id={id} {...rest} />
          </div>
          <div
            className="grid-item__edit"
            onClick={() => onEditItem(fieldId)}
          ><Icon name="edit" /></div>
          <div
            className="grid-item__delete"
            onClick={() => fields.remove(index)}
          ><Icon name="delete" /></div>
        </div>
      </Flipped>
    </div>
  );
};

export { GridItem };

export default GridItem;
