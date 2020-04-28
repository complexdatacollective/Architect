import React from 'react';

const UnsavedChanges = options => ({
  type: 'Warning',
  title: 'Unsaved changes',
  message: (
    <div>
      <p><strong>The current protocol has unsaved changes!</strong></p>
    </div>
  ),
  ...options,
});

export default UnsavedChanges;
