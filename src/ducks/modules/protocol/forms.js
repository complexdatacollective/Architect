import { omit } from 'lodash';

const CREATE_FORM = 'CREATE_FORM';
const UPDATE_FORM = 'UPDATE_FORM';
const DELETE_FORM = 'DELETE_FORM';

const initialState = {
};

const formTemplate = {
  name: '',
  fields: [],
  optionToAddAnother: false,
};

const formNameFromTitle = title => title.replace(/\W/g, '');

function createForm(form) {
  return {
    type: CREATE_FORM,
    form: { ...form, entity: 'node' },
  };
}

function updateForm(formName, form) {
  return {
    type: UPDATE_FORM,
    formName,
    form: { ...form, entity: 'node' },
  };
}

function deleteForm(formName) {
  return {
    type: DELETE_FORM,
    formName,
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
    case DELETE_FORM:
      return omit(state, [action.formName]);
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
  CREATE_FORM,
  UPDATE_FORM,
  DELETE_FORM,
};

export {
  actionCreators,
  actionTypes,
};
