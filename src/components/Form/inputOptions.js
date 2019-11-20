import { keys, values } from 'lodash';

const VARIABLE_TYPES = {
  number: {
    label: 'Number',
    value: 'number',
  },
  text: {
    label: 'Text',
    value: 'text',
  },
  boolean: {
    label: 'Boolean',
    value: 'boolean',
  },
  ordinal: {
    label: 'Ordinal',
    value: 'ordinal',
  },
  categorical: {
    label: 'Categorical',
    value: 'categorical',
  },
  scalar: {
    label: 'Scalar',
    value: 'scalar',
  },
};

const COMPONENTS = {
  TextInput: {
    label: 'Text Input',
    value: 'Text',
    description: 'This is a standard text input, allowing for simple data entry up to approximately 30 characters.',
    image: 'TextInput',
  },
  NumberInput: {
    label: 'Number Input',
    value: 'Number',
    description: 'This input is optomized for collecting numerical data, and will show a number pad if available.',
    image: 'NumberInput',
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
  Slider: {
    label: 'Slider',
    value: 'Slider',
    description: 'Select a number from from 0.000 - 1.000',
    image: 'Slider',
  },
  LikertScale: {
    label: 'LikertScale',
    value: 'LikertScale',
    description: 'A likert-type scale using option values',
    image: 'LikertScale',
  },
  VisualAnalogScale: {
    label: 'VisualAnalogScale',
    value: 'VisualAnalogScale',
    description: 'A Visual Analog Scale will set a number from 0.000 - 1.000, repesenting either end of the scale.',
    image: 'VisualAnalogScale',
  },
};

const VARIABLE_TYPES_WITH_OPTIONS = [
  'ordinal',
  'categorical',
];

const VARIABLE_TYPES_WITH_PARAMETERS = [
  'scalar',
];

const VARIABLE_TYPES_WITH_COMPONENTS = keys(VARIABLE_TYPES);

const getComponentsForType = (type) => {
  switch (type) {
    case 'number':
      return [COMPONENTS.NumberInput, COMPONENTS.Slider];
    case 'scalar':
      return [COMPONENTS.VisualAnalogScale];
    case 'text':
      return [COMPONENTS.TextInput];
    case 'boolean':
      return [COMPONENTS.Toggle];
    case 'ordinal':
      return [COMPONENTS.RadioGroup, COMPONENTS.LikertScale];
    case 'categorical':
      return [COMPONENTS.CheckboxGroup, COMPONENTS.ToggleButtonGroup];
    default:
      return [COMPONENTS.TextInput];
  }
};

const getTypeForComponent = (input) => {
  switch (input) {
    case COMPONENTS.NumberInput.value:
    case COMPONENTS.Slider.value:
      return 'number';
    case COMPONENTS.TextInput.value:
      return 'text';
    case COMPONENTS.Toggle.value:
      return 'boolean';
    case COMPONENTS.RadioGroup.value:
    case COMPONENTS.LikertScale.value:
      return 'ordinal';
    case COMPONENTS.VisualAnalogScale.value:
      return 'scalar';
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

const variableOptions = values(VARIABLE_TYPES);

const getColorForType = (type) => {
  switch (type) {
    case 'number':
      return 'var(--color-paradise-pink)';
    case 'text':
      return 'var(--color-slate-blue)';
    case 'boolean':
      return 'var(--color-neon-carrot)';
    case 'ordinal':
    case 'categorical':
      return 'var(--color-sea-green--dark)';
    default:
      return 'var(--color-navy-taupe)';
  }
};

export {
  COMPONENTS,
  VARIABLE_TYPES_WITH_OPTIONS,
  VARIABLE_TYPES_WITH_COMPONENTS,
  inputOptions,
  variableOptions,
  getTypeForComponent,
  getComponentsForType,
  getColorForType,
  isVariableTypeWithOptions,
};

export default inputOptions;
