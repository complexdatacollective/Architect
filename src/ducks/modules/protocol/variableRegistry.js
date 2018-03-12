const initialState = {
  node: {
    person: {},
    place: {},
  },
  edge: {
    familyMember: {},
    friend: {},
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

const actionCreators = {
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};
