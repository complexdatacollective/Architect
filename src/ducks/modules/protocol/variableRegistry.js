const initialState = {
  node: {
    person: {
      label: 'Person',
      color: 'coral',
      displayVariable: 'nickname',
      variables: {
        name: {
          label: 'Name',
          description: 'Human readable description',
          type: 'text',
          validation: {
            required: true,
            minLength: 1,
            maxLength: 24,
          },
        },
        age: {
          label: 'Age',
          description: 'Human readable description',
          type: 'number',
          validation: {
            required: true,
            minValue: 16,
            maxValue: 100,
          },
        },
        nickname: {
          label: 'Nickname',
          description: 'Human readable description',
          type: 'text',
          validation: {
            required: true,
            minLength: 1,
            maxLength: 8,
          },
        },
        special_category: {
          label: 'Special category',
          description: 'Human readable description',
          type: 'enumerable',
          options: [46],
        },
        some_options: {
          label: 'Some possible options',
          description: 'Human readable description',
          type: 'options',
          options: [46],
          validation: {
            max: 1,
          },
        },
        close_friend: {
          label: 'Close Friend',
          description: 'Human readable description',
          type: 'boolean',
        },
        support_friend: {
          label: 'Support Friend',
          description: 'Human readable description',
          type: 'boolean',
        },
        advice_friend: {
          label: 'Advice Friend',
          description: 'Human readable description',
          type: 'boolean',
        },
        has_given_advice: {
          label: 'Has given advice?',
          description: 'Human readable description',
          type: 'boolean',
        },
      },
    },
    venue: {
      label: 'Venue',
      color: 'kiwi',
      variables: {
        name: {
          label: 'Name',
          description: 'Human readable description',
          type: 'text',
          validation: {
            required: true,
            minLength: 1,
            maxLength: 24,
          },
        },
        location: {
          label: 'Location',
          description: 'Human readable description',
          type: 'coordinates',
        },
      },
    },
  },
  edge: {
    friend: {
      label: 'Friend',
      color: 'mustard',
      variables: {
        contact_freq: {
          label: 'contact_freq',
          description: 'Contact frequency.',
          type: 'ordinal',
          values: {
            'Very Often': 4,
            Often: 3,
            Sometimes: 2,
            Rarely: 1,
            Never: -1,
          },
        },
      },
    },
    professional: {
      label: 'Professional',
      color: 'kiwi',
      variables: {
      },
    },
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
