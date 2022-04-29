import { USER_AUTH } from '../const/index';

const UserAuthReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_AUTH:
      state = action.userAuth;
      return state;
    default:
      return state;
  }
};

export default UserAuthReducer;
