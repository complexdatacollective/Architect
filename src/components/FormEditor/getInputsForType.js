const inputDefinitions = {
  NumberInput: {
    label: 'Number Input',
    value: 'Number',
    description: 'This input is optimized for collecting numerical data, and will show a number pad if available.',
    image: 'TextInput',
  },
  CheckboxGroup: {
    label: 'Checkbox Group',
    value: 'CheckboxGroup',
    description: 'This component provides a group of checkboxes so that multiple values can be toggled on or off.',
    image: 'CheckboxGroup',
  },
  Toggle: {
    label: 'Toggle',
    value: 'Toggle',
    description: 'This component renders a switch, which can be tapped or clicked to indicate "on" or "off".',
    image: 'Toggle',
  },
  RadioGroup: {
    label: 'Radio Group',
    value: 'RadioGroup',
    description: 'This will render a group of options and allow the user to choose one. Useful for likert-type scales or other ordinal variables.',
    image: 'RadioGroup',
  },
  ToggleButtonGroup: {
    label: 'Toggle Button Group',
    value: 'ToggleButtonGroup',
    description: 'This component provides a colorful button that can be toggled "on" or "off". It is useful for categorical variables where multiple options can be selected.',
    image: 'ToggleButtonGroup',
  },
  TextInput: {
    label: 'Text Input',
    value: 'Text',
    description: 'This is a standard text input, allowing for simple data entry up to approximately 30 characters.',
    image: 'TextInput',
  },
};

const getInputsForType = (type) => {
  switch (type) {
    case 'number':
      return [inputDefinitions.TextInput, inputDefinitions.NumberInput];
    case 'text':
      return [inputDefinitions.TextInput];
    case 'boolean':
      return [inputDefinitions.Toggle];
    case 'ordinal':
      return [inputDefinitions.RadioGroup];
    case 'categorical':
      return [inputDefinitions.CheckboxGroup, inputDefinitions.ToggleButtonGroup];
    default:
      return [inputDefinitions.TextInput];
  }
};

export default getInputsForType;
