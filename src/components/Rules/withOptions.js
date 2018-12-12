import { map, get, reduce } from 'lodash';
import { withProps } from 'recompose';
import { validTypes, operatorsAsOptions, operatorsByType } from './options';

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

  return operatorsAsOptions.filter(({ value }) => operatorsForType.has(value));
};

const withOptions = entityCategory =>
  withProps((props) => {
    const entityTypes = get(props.variableRegistry, entityCategory, {});

    const entityId = get(props.rule, 'options.type', null);

    const variableId = get(props.rule, 'options.variable', null);

    const variableType = get(
      props.variableRegistry,
      [entityCategory, entityId, 'variables', variableId, 'type'],
      '',
    );

    const typeOptions = map(entityTypes, (entity, id) => ({
      value: id,
      label: entity.label,
    }));

    const variableOptions = getVariableOptions(props.variableRegistry, entityCategory, entityId);

    const operatorOptions = getOperatorsForType(variableType);

    return {
      typeOptions,
      variableOptions,
      operatorOptions,
      variableType,
    };
  });

export default withOptions;
