const CREATE_FORM = 'CREATE_FORM';
const UPDATE_FORM = 'UPDATE_FORM';
const DELETE_FORM = 'DELETE_FORM';

const initialState = {
};

const formTemplate = {
  name: '',
  varirables: [],
};

const formNameFromTitle = title => title.replace(/\W/g, '');

function createForm(form) {
  return {
    type: CREATE_FORM,
    form,
  };
}

function updateForm(formName, form) {
  return {
    type: UPDATE_FORM,
    formName,
    form,
  };
}

function deleteForm() {
  return {
    type: DELETE_FORM,
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_FORM: {
      const form = { ...formTemplate, ...action.form };

      return {
        ...state,
        [formNameFromTitle(form.title)]: form,
      };
    }
    case UPDATE_FORM:
      return {
        ...state,
        [action.formName]: {
          ...state[action.formName],
          ...action.form,
        },
      };
    default:
      return state;
  }
}

const actionCreators = {
  createForm,
  updateForm,
  deleteForm,
};

const actionTypes = {
};

export {
  actionCreators,
  actionTypes,
};
