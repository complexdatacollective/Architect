import { values } from 'lodash';

const components = {
  NumberInput: {
    label: 'Number Input',
    value: 'Number',
    description: 'This input is optomized for collecting numerical data, and will show a number pad if available.',
    image: 'TextInput',
  },
  Checkbox: {
    label: 'Checkbox',
    value: 'Checkbox',
    description: 'This is a simple checkbox component that can be clicked or tapped to toggle a value between true or false.',
    image: 'Checkbox',
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
  ToggleButton: {
    label: 'Toggle Button',
    value: 'ToggleButton',
    description: 'This component provides a colorful button that can be toggled "on" or "off". It is useful for categorical variables where multiple options can be selected.',
    image: 'ToggleButton',
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
      return [components.TextInput, components.NumberInput];
    case 'text':
      return [components.TextInput];
    case 'boolean':
      return [components.Checkbox, components.Toggle, components.ToggleButton];
    case 'ordinal':
      return [components.RadioGroup];
    case 'categorical':
      return [components.CheckboxGroup, components.ToggleButtonGroup];
    default:
      return [components.TextInput];
  }
};

const getTypeForInput = (input) => {
  switch (input) {
    case components.NumberInput.value:
      return 'number';
    case components.TextInput.value:
      return 'text';
    case components.Checkbox.value:
    case components.Toggle.value:
    case components.ToggleButton.value:
      return 'boolean';
    case components.RadioGroup.value:
      return 'ordinal';
    case 'categorical':
    case components.CheckboxGroup.value:
    case components.ToggleButtonGroup.value:
      return 'categorical';
    default:
      return 'text';
  }
};

const inputOptions = values(components);

export {
  components,
  inputOptions,
  getTypeForInput,
  getInputsForType,
};

export default inputOptions;
