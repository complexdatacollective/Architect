export const getSession = state => state.session;

export const getActiveProtocol = (state) => {
  const session = getSession(state);

  return session.filePath;
};

export const getHasUnsavedChanges = (state) => {
  const session = getSession(state);
  const activeProtocol = getActiveProtocol(state);

  return activeProtocol && (session.lastChanged > session.lastSaved);
};
