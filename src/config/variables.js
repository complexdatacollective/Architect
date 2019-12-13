export const VARIABLE_TYPES = {
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
  datetime: {
    label: 'Date',
    value: 'datetime',
  },
};

export const COMPONENTS = {
  TextInput: {
    label: 'Text Input',
    value: 'Text',
    description: 'This is a standard text input, allowing for simple data entry up to approximately 30 characters.',
    image: 'TextInput',
  },
  TextArea: {
    label: 'Text Area',
    value: 'TextArea',
    description: 'This is an extra lage text input, allowing for simple data entry for more than 30 characters.',
    image: 'TextArea',
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
  DatePicker: {
    label: 'DatePicker',
    value: 'DatePicker',
    description: 'A calendar date picker',
    image: 'DatePicker',
  },
  RelativeDatePicker: {
    label: 'RelativeDatePicker',
    value: 'RelativeDatePicker',
    description: 'A calendar date picker',
    image: 'RelativeDatePicker',
  },
};

export const VARIABLE_TYPES_COMPONENTS = [
  ['number', [COMPONENTS.NumberInput], 'var(--color-paradise-pink)'],
  ['scalar', [COMPONENTS.VisualAnalogScale], 'var(--color-cerulean-blue)'],
  ['datetime', [COMPONENTS.DatePicker, COMPONENTS.RelativeDatePicker]],
  ['text', [COMPONENTS.TextInput, COMPONENTS.TextArea], 'var(--color-slate-blue)'],
  ['boolean', [COMPONENTS.Toggle], 'var(--color-neon-carrot)'],
  ['ordinal', [COMPONENTS.RadioGroup, COMPONENTS.LikertScale], 'var(--color-sea-green--dark)'],
  ['categorical', [COMPONENTS.CheckboxGroup, COMPONENTS.ToggleButtonGroup], 'var(--color-sea-green--dark)'],
];

export const VARIABLE_TYPES_WITH_OPTIONS = [
  'ordinal',
  'categorical',
];

export const VARIABLE_TYPES_WITH_PARAMETERS = [
  'scalar',
  'datetime',
];

export const VARIABLE_TYPES_WITH_COMPONENTS = VARIABLE_TYPES_COMPONENTS
  .map(([type]) => type);

export const INPUT_OPTIONS = Object.values(COMPONENTS);

export const VARIABLE_OPTIONS = Object.values(VARIABLE_TYPES);

const isVariableTypeWithOptions = variableType =>
  VARIABLE_TYPES_WITH_OPTIONS.includes(variableType);

const isVariableTypeWithParameters = variableType =>
  VARIABLE_TYPES_WITH_PARAMETERS.includes(variableType);

const findByType = type =>
  ([t]) => t === type;
const findByComponent = component =>
  ([, c]) => c.some(({ value }) => value === component);
const findTypeIndex = findBy =>
  VARIABLE_TYPES_COMPONENTS.find(findBy) || [null, null, null];

const getComponentsForType = (type) => {
  const [, components] = findTypeIndex(findByType(type));

  if (!components) { return [COMPONENTS.TextInput]; }

  return components;
};

const getTypeForComponent = (component) => {
  const [type] = findTypeIndex(findByComponent(component));

  return type;
};

const getColorForType = (type) => {
  const [,, color] = findTypeIndex(findByType(type));

  if (!color) { return 'var(--color-navy-taupe)'; }
  return color;
};

export {
  INPUT_OPTIONS as inputOptions,
  VARIABLE_OPTIONS as variableOptions,
  getTypeForComponent,
  getComponentsForType,
  getColorForType,
  isVariableTypeWithOptions,
  isVariableTypeWithParameters,
};

export default INPUT_OPTIONS;

