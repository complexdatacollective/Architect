const initialState = {
  person: {
    title: 'Add A Person',
    entity: 'node',
    type: 'person',
    fields: [
      {
        variable: 'name',
        component: 'TextInput',
      },
      {
        variable: 'nickname',
        component: 'TextInput',
      },
      {
        variable: 'age',
        component: 'TextInput',
      },
      {
        variable: 'timeCreated',
        component: 'hidden',
        value: 'return Date.now().toString();',
      },
    ],
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
