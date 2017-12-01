import React from 'react';
import PropTypes from 'prop-types';
import { Button, SeamlessTextInput } from '../../components/Form';

const Title = ({ title, onChange }) => (
  <div className="edit-stage-title">
    <SeamlessTextInput value={title} onChange={onChange} />
    <Button size="small">Tiggle code view</Button>
  </div>
);

Title.propTypes = {
  title: PropTypes.text,
  onChange: PropTypes.func,
};

Title.defaultProps = {
  title: '',
  onChange: () => {},
};

export default Title;
