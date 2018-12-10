import { map, get, reduce } from 'lodash';
import { withProps } from 'recompose';
import { validTypes, operators, operatorsByType } from './options';

const getVariableOptions = (variableRegistry, entityCategory, entityId) => {
  const variables = get(
    variableRegistry,
    [entityCategory, entityId, 'variables'],
    {},
  );

  const variableOptions = reduce(
    variables,
    (acc, variable, variableId) => {
      if (!validTypes.has(variable.type)) { return acc; }
      return [
        ...acc,
        {
          value: variableId,
          label: variable.label,
        },
      ];
    },
    [],
  );

  return variableOptions;
};

const getOperatorsForType = (type) => {
  const operatorsForType = get(operatorsByType, type, operatorsByType.text);

  return operators.filter(({ value }) => operatorsForType.has(value));
};

const withOptions = entityCategory =>
  withProps(props => ({
    typeOptions: () => {
      const entityTypes = get(props.variableRegistry, entityCategory, {});

      const typeOptions = map(entityTypes, (entity, entityId) => ({
        value: entityId,
        label: entity.label,
      }));

      return typeOptions;
    },
    variableOptions: () => {
      const entityId = get(props.rule, 'options.type', null);
      return getVariableOptions(props.variableRegistry, entityCategory, entityId);
    },
    operatorOptions: () => {
      const entityId = get(props.rule, 'options.type', null);
      const variableId = get(props.rule, 'options.variable', null);
      const variableType = get(
        props.variableRegistry,
        [entityCategory, entityId, 'variables', variableId, 'type'],
        {},
      );
      const operatorOptions = getOperatorsForType(variableType);

      return operatorOptions;
    },
  }));

export default withOptions;
