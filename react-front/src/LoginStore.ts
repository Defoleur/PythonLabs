import { createStore } from 'redux';

const initialState = {
  isLoggedIn: false
};
type Action = { type: 'LOGIN' } | { type: 'LOGOUT' };
const authReducer = (state = initialState, action:Action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

const store = createStore(authReducer);

export default store;
