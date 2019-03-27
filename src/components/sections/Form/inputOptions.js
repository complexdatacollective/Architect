import { values } from 'lodash';

const COMPONENTS = {
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

const VARIABLE_TYPES_WITH_OPTIONS = [
  'ordinal',
  'categorical',
];

const getComponentsForType = (type) => {
  switch (type) {
    case 'number':
      return [COMPONENTS.TextInput, COMPONENTS.NumberInput];
    case 'text':
      return [COMPONENTS.TextInput];
    case 'boolean':
      return [COMPONENTS.Checkbox, COMPONENTS.Toggle, COMPONENTS.ToggleButton];
    case 'ordinal':
      return [COMPONENTS.RadioGroup];
    case 'categorical':
      return [COMPONENTS.CheckboxGroup, COMPONENTS.ToggleButtonGroup];
    default:
      return [COMPONENTS.TextInput];
  }
};

const getTypeForComponent = (input) => {
  switch (input) {
    case COMPONENTS.NumberInput.value:
      return 'number';
    case COMPONENTS.TextInput.value:
      return 'text';
    case COMPONENTS.Checkbox.value:
    case COMPONENTS.Toggle.value:
    case COMPONENTS.ToggleButton.value:
      return 'boolean';
    case COMPONENTS.RadioGroup.value:
      return 'ordinal';
    case 'categorical':
    case COMPONENTS.CheckboxGroup.value:
    case COMPONENTS.ToggleButtonGroup.value:
      return 'categorical';
    default:
      return null;
  }
};

const isVariableTypeWithOptions = variableType =>
  VARIABLE_TYPES_WITH_OPTIONS.includes(variableType);

const inputOptions = values(COMPONENTS);

const getColorForType = (type) => {
  switch (type) {
    case 'number':
    case 'text':
      return 'var(--color-mustard--dark)';
    case 'boolean':
      return 'var(--color-sea-green)';
    case 'ordinal':
    case 'categorical':
      return 'var(--color-sea-green--dark)';
    default:
      return 'var(--color-slate-blue--dark)';
  }
};

export {
  COMPONENTS,
  VARIABLE_TYPES_WITH_OPTIONS,
  inputOptions,
  getTypeForComponent,
  getComponentsForType,
  getColorForType,
  isVariableTypeWithOptions,
};

export default inputOptions;
