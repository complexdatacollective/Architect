import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';

const PresetElement = (prop) => (
    <Fields.RadioGroup 
      options={[
        {label: 'person', value: 'Person'},
      ]}
    />
)

export default PresetElement;