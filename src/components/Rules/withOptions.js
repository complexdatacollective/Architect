import { map, get, reduce } from 'lodash';
import { withProps } from 'recompose';
import { validTypes, operatorsAsOptions, operatorsByType } from './options';

const getVariablesAsOptions = (variables) => {
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
  const operatorsForType = get(operatorsByType, type, operatorsByType.exists);

  return operatorsAsOptions.filter(({ value }) => operatorsForType.has(value));
};

const withOptions = entityCategory =>
  withProps((props) => {
    const entityId = get(props.rule, 'options.type', null);
    const variableId = get(props.rule, 'options.variable', null);

    const variablesRoot = entityCategory === 'ego' ?
      ['ego', 'variables'] :
      [entityCategory, entityId, 'variables'];

    const entityTypes = get(props.variableRegistry, entityCategory, {});

    const typeOptions = map(entityTypes, (entity, id) => ({
      value: id,
      label: entity.label,
      color: entity.color,
    }));

    const variableOptions = getVariablesAsOptions(get(props.variableRegistry, variablesRoot, {}));

    const variableType = get(
      props.variableRegistry,
      [...variablesRoot, variableId, 'type'],
      '',
    );

    const operatorOptions = getOperatorsForType(variableType);

    return {
      typeOptions,
      variableOptions,
      operatorOptions,
      variableType,
    };
  });

export default withOptions;
