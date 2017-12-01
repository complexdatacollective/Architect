/* eslint-disable */
import React from 'react';
import { Button, SeamlessTextInput } from '../../components/Form';

const Title = ({ title, onChange }) => (
  <div className="edit-stage__title">
    <SeamlessTextInput value={title} onChange={onChange} />
    <Button size="small">Tiggle code view</Button>
  </div>
);

export default Title;
