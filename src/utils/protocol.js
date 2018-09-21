/* eslint-disable import/prefer-default-export */

export const getObjectLabel = (protocol, protocolObject) => {
  switch (protocolObject.type) {
    case 'form':
      return protocol.forms[protocolObject.id].title;
    case 'stage':
      return protocol.stages.find(({ id }) => id === protocolObject.id).label;
    case 'prompt':
      return protocol.stages
        .find(({ id }) => id === protocolObject.stageId).prompts
        .find(({ id }) => id === protocolObject.promptId).text;
    default:
      return '';
  }
};
