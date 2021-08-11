import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'redux-form';
import { Button } from '@codaco/ui';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import ContextualDialog from '@components/ContextualDialog';
// import DownloadIcon from '@material-ui/icons/GetApp';

const RenameVariable = ({
  id,
  onSave,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const controls = [
    <Button
      onClick={onClose}
      color="white"
    >
      Close
    </Button>,
    <Button type="submit">
      Save
    </Button>,
  ];

  const handleSubmit = useCallback((...args) => {
    console.log({ args });
    // onSave
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <div className="rename-variable">
      <button
        type="button"
        onClick={handleOpen}
      >
        Rename
      </button>
      { isOpen && (
        <ContextualDialog
          className="rename-variable__dialog"
          windowRoot={document.body}
        >
          <form onSubmit={handleSubmit}>
            <TextField name="" />
            {controls}
          </form>
        </ContextualDialog>
      )}
    </div>
  );
};

RenameVariable.propTypes = {
  id: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
};

RenameVariable.defaultProps = {
  onSave: () => {},
  onClose: () => {},
};

const mapStateToProps = (state) => {
  // console.log(state);
  return {};
};

export default connect(mapStateToProps)(RenameVariable);
