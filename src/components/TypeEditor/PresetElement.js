import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui';
import { actionCreators as screenActions } from '@modules/ui/screens';
import Radio from '../Form/Fields/Radio';
import PreviewNode from '../sections/fields/EntitySelectField/PreviewNode';

const PresetElement = (props) => {
  const { label, color } = props;
  const dispatch = useDispatch();
  const openScreen = (screen, params) => dispatch(screenActions.openScreen(screen, params));
  const handleOpenCreateNewType = useCallback(() => {
    openScreen('type', {
      entity: 'node', ifPreset: false, nodeNameForEdit: label, nodeColorForEdit: color,
    });
  }, [openScreen, encodeURI]);
  return (
    <Radio
      className="preset-node"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      label={
        (
          <>
            <PreviewNode label={label} color={color} />
            <Button onClick={handleOpenCreateNewType}>Customize the node</Button>
          </>
          )
      }
    />
  );
};

PresetElement.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default PresetElement;
