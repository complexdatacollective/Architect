/* eslint-disable import/prefer-default-export */
import { flatMap, reduce, get } from 'lodash';
import { utils, paths } from '../../selectors/indexes';

const buildVariableEntry = (
  protocol,
  variablePaths,
  fields,
  entity,
  entityType,
) => (variableConfiguration, variableId) => {
  const usage = reduce(variablePaths, (memo, id, variablePath) => {
    if (id !== variableId) { return memo; }
    return [...memo, variablePath];
  }, []);

  const stages = usage.map((path) => {
    const [stagePath] = path.split('.');
    return get(protocol, `${stagePath}.id`);
  });

  const field = fields.find((f) => f.variable === variableId);

  return {
    id: variableId,
    name: variableConfiguration.name,
    type: variableConfiguration.type,
    component: variableConfiguration.component,
    prompt: field && field.prompt,
    subject: { entity, type: entityType !== 'ego' && entityType },
    stages,
    usage,
  };
};

export const getCodebookIndex = (protocol) => {
  const variablePaths = utils.collectPaths(paths.variables, protocol);

  const fields = flatMap(
    protocol.stages,
    (stage) => {
      if (!stage.form) { return []; }

      return stage.form.fields;
    },
  );

  const protocolEntities = [
    ...(protocol.codebook.node ? ['node'] : []),
    ...(protocol.codebook.edge ? ['edge'] : []),
    ...(protocol.codebook.ego ? ['ego'] : []),
  ];

  const index = flatMap(
    protocolEntities,
    (entity) => {
      const entityConfigurations = (
        entity === 'ego'
          ? { ego: protocol.codebook[entity] }
          : protocol.codebook[entity]
      );

      return flatMap(
        entityConfigurations,
        (entityConfiguration, entityType) => flatMap(
          entityConfiguration.variables,
          buildVariableEntry(protocol, variablePaths, fields, entity, entityType),
        ),
      );
    },
  );

  return index;
};
