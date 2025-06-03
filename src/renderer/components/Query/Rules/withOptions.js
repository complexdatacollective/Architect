import { map, get, reduce } from 'lodash';
import { withProps } from 'recompose';
import { validTypes, operatorsAsOptions, operatorsByType } from './options';

const getVariablesAsOptions = (variables) => {
  const variablesAsOptions = reduce(
    variables,
    (acc, variable, variableId) => {
      if (!validTypes.has(variable.type)) { return acc; }
      return [
        ...acc,
        {
          value: variableId,
          label: variable.name,
        },
      ];
    },
    [],
  );

  return variablesAsOptions;
};

const getOperatorsForType = (type) => {
  const operatorsForType = get(operatorsByType, type, operatorsByType.exists);

  return operatorsAsOptions.filter(({ value }) => operatorsForType.has(value));
};

const withOptions = withProps((props) => {
  const entityType = get(props.rule, 'type');

  const entityId = get(props.rule, 'options.type', null);
  const variableId = get(props.rule, 'options.attribute', null);

  const variablesRoot = () => {
    if (entityType === 'ego') {
      return ['ego', 'variables'];
    }

    if (entityType === 'alter') {
      return ['node', entityId, 'variables'];
    }

    return ['edge', entityId, 'variables'];
  };

  const entitiesOfType = get(props.codebook, entityType, {});

  const typeOptions = map(entitiesOfType, (entity, id) => ({
    value: id,
    label: entity.name,
    color: entity.color,
  }));

  const variablesAsOptions = getVariablesAsOptions(get(props.codebook, variablesRoot(), {}));

  const variableType = get(
    props.codebook,
    [...variablesRoot(), variableId, 'type'],
    null,
  );

  const variableOptions = get(
    props.codebook,
    [...variablesRoot(), variableId, 'options'],
    null,
  );

  const operatorOptions = getOperatorsForType(variableType);

  return {
    typeOptions,
    variablesAsOptions,
    variableOptions,
    operatorOptions,
    variableType,
  };
});

export default withOptions;
