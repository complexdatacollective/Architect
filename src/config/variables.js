import { get } from 'lodash';
import NumberVariable from '../images/variables/number-variable.svg';
import TextVariable from '../images/variables/text-variable.svg';
import BooleanVariable from '../images/variables/boolean-variable.svg';
import OrdinalVariable from '../images/variables/ordinal-variable.svg';
import CategoricalVariable from '../images/variables/categorical-variable.svg';
import ScalarVariable from '../images/variables/scalar-variable.svg';
import DateVariable from '../images/variables/date-variable.svg';
import LayoutVariable from '../images/variables/layout-variable.svg';
import LocationVariable from '../images/variables/location-variable.svg';
import DefaultVariable from '../images/variables/default-variable.svg';

// TODO: This should be a monolithic object that contains all variable types
// and properties. All other derivations/permutations of this data should be
// merged into this object.
//
// For example: input components, if the variable has options or properties,
// etc. Then the required properties can be picked from this object using
// map/reduce/get etc.
export const VARIABLE_TYPES = {
  number: {
    label: 'Number',
    value: 'number',
    icon: NumberVariable,
    color: 'var(--color-paradise-pink)',
  },
  text: {
    label: 'Text',
    value: 'text',
    icon: TextVariable,
    color: 'var(--color-cerulean-blue)',
  },
  boolean: {
    label: 'Boolean',
    value: 'boolean',
    icon: BooleanVariable,
    color: 'var(--color-neon-carrot)',
  },
  ordinal: {
    label: 'Ordinal',
    value: 'ordinal',
    icon: OrdinalVariable,
    color: 'var(--color-sea-green)',
  },
  categorical: {
    label: 'Categorical',
    value: 'categorical',
    icon: CategoricalVariable,
    color: 'var(--color-mustard)',
  },
  scalar: {
    label: 'Scalar',
    value: 'scalar',
    icon: ScalarVariable,
    color: 'var(--color-kiwi)',
  },
  datetime: {
    label: 'Date',
    value: 'datetime',
    icon: DateVariable,
    color: 'var(--color-tomato)',
  },
  layout: {
    label: 'Layout',
    value: 'layout',
    icon: LayoutVariable,
    color: 'var(--color-purple-pizazz)',
  },
  location: {
    label: 'Location',
    value: 'location',
    icon: LocationVariable,
    color: 'var(--color-slate-blue--dark)',
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
    description: 'This is an extra large text input, allowing for simple data entry for more than 30 characters.',
    image: 'TextArea',
  },
  NumberInput: {
    label: 'Number Input',
    value: 'Number',
    description: 'This input is optimized for collecting numerical data, and will show a number pad if available.',
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
    description: 'This component renders a switch, which can be tapped or clicked to indicate "on" or "off". By default it is in the "off" position. If you require a boolean input without a default, use the BooleanChoice component',
    image: 'Toggle',
  },
  RadioGroup: {
    label: 'Radio Group',
    value: 'RadioGroup',
    description: 'This component renders a group of options and allow the user to choose one.',
    image: 'RadioGroup',
  },
  ToggleButtonGroup: {
    label: 'Toggle Button Group',
    value: 'ToggleButtonGroup',
    description: 'This component provides a colorful button that can be toggled "on" or "off". It is an alternative to the Checkbox Group, and allows multiple selection by default.',
    image: 'ToggleButtonGroup',
  },
  LikertScale: {
    label: 'LikertScale',
    value: 'LikertScale',
    description: 'A component providing a likert-type scale in the form of a slider. Values are derived from the option properties of this variable, with labels for each option label.',
    image: 'LikertScale',
  },
  VisualAnalogScale: {
    label: 'VisualAnalogScale',
    value: 'VisualAnalogScale',
    description: 'A Visual Analog Scale (VAS) component, which sets a normalized value between 0 and 1 representing the position of the slider between each end of the scale.',
    image: 'VisualAnalogScale',
  },
  DatePicker: {
    label: 'DatePicker',
    value: 'DatePicker',
    description: 'A calendar date picker that allows a respondent to quickly enter year, month, and day data.',
    image: 'DatePicker',
  },
  RelativeDatePicker: {
    label: 'RelativeDatePicker',
    value: 'RelativeDatePicker',
    description: 'A calendar date picker that automatically limits available dates relative to an "anchor date", which can be configured to the date of the interview session. ',
    image: 'RelativeDatePicker',
  },
  BooleanChoice: {
    label: 'BooleanChoice',
    value: 'Boolean',
    description: 'A component for boolean variables that requires the participant to actively select an option. Unlike the toggle component, this component accepts the "required" validation.',
    image: 'BooleanChoice',
  },
};

export const VARIABLE_TYPES_COMPONENTS = [
  ['number', [COMPONENTS.NumberInput], '-- Number Types -- '],
  ['scalar', [COMPONENTS.VisualAnalogScale], '-- Scalar Types --'],
  ['datetime', [COMPONENTS.DatePicker, COMPONENTS.RelativeDatePicker], '-- Date Types --'],
  ['text', [COMPONENTS.TextInput, COMPONENTS.TextArea], '-- Text Types --'],
  ['boolean', [COMPONENTS.BooleanChoice, COMPONENTS.Toggle], '-- Boolean Types --'],
  ['ordinal', [COMPONENTS.RadioGroup, COMPONENTS.LikertScale], '-- Ordinal Types --'],
  ['categorical', [COMPONENTS.CheckboxGroup, COMPONENTS.ToggleButtonGroup], '-- Categorical Types --'],
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

const formattedInputOptions = VARIABLE_TYPES_COMPONENTS.reduce((accumulator, currentValue) => ([
  ...accumulator,
  { label: currentValue[2], value: null, disabled: true },
  ...currentValue[1],
]), []);

export const VARIABLE_OPTIONS = Object.values(VARIABLE_TYPES);

const isOrdinalOrCategoricalType = (
  variableType,
) => VARIABLE_TYPES_WITH_OPTIONS.includes(variableType);

const isVariableTypeWithParameters = (
  variableType,
) => VARIABLE_TYPES_WITH_PARAMETERS.includes(variableType);

const isBooleanWithOptions = (component) => component === COMPONENTS.BooleanChoice.value;

const findByType = (type) => ([t]) => t === type;
const findByComponent = (component) => ([, c]) => c.some(({ value }) => value === component);
const findTypeIndex = (findBy) => VARIABLE_TYPES_COMPONENTS.find(findBy) || [null, null, null];

const getComponentsForType = (type) => {
  const [, components] = findTypeIndex(findByType(type));

  if (!components) { return [COMPONENTS.TextInput]; }

  return components;
};

const getTypeForComponent = (component) => {
  const [type] = findTypeIndex(findByComponent(component));

  return type;
};

const getColorForType = (type) => get(VARIABLE_TYPES, [type, 'color'], 'var(--color-charcoal)');

const getIconForType = (type) => get(VARIABLE_TYPES, `${type}.icon`, DefaultVariable);

export {
  INPUT_OPTIONS as inputOptions,
  formattedInputOptions,
  VARIABLE_OPTIONS as variableOptions,
  getTypeForComponent,
  getComponentsForType,
  getIconForType,
  getColorForType,
  isOrdinalOrCategoricalType,
  isVariableTypeWithParameters,
  isBooleanWithOptions,
};

export default INPUT_OPTIONS;
