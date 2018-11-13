const setInterfaceScale = newScale => ({
  type: 'SETTINGS/SET_INTERFACE_SCALE',
  scale: newScale,
});

const refreshPreview = () => ({
  type: 'PREVIEW/REFRESH',
});

const dispatch = (target, action) => {
  target.send('ACTION', action);
};

const actionCreators = {
  setInterfaceScale,
  refreshPreview,
};

module.exports = {
  actionCreators,
  dispatch,
};
