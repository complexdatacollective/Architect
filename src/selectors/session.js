const getSession = state => state.session;

export const getHasUnsavedChanges = (state) => {
  const session = getSession(state);

  return session.activeProtocol && (session.lastChanged > session.lastSaved);
};
