/* eslint-disable import/prefer-default-export */
import { flatMap, reduce, get } from 'lodash';
import { utils, paths } from '../../selectors/indexes';

export const getCodebookIndex = (protocol) => {
  const variablePaths = utils.collectPaths(paths.variables, protocol);

  const fields = flatMap(
    protocol.stages,
    (stage) => {
      if (!stage.form) { return []; }

      return stage.form.fields;
    },
  );

  const index = flatMap(
    protocol.codebook,
    (entityConfigurations, entity) => flatMap(
      entityConfigurations,
      (entityConfiguration, entityType) => flatMap(
        entityConfiguration.variables,
        (variableConfiguration, variableId) => {
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
            prompt: field && field.prompt,
            subject: { entity, type: entityType },
            stages,
            usage,
          };
        },
      ),
    ),
  );

  return index;
};
