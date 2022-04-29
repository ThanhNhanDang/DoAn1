import { EMAILS } from '../const/index';

const EmailsReducer = (state = {}, action) => {
  switch (action.type) {
    case EMAILS:
      return action.emails;

    default:
      return state;
  }
};

export default EmailsReducer;
