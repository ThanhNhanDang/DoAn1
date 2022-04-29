import { RELAY1_ON_OFF } from '../const/index';

const OnOffRelay1Reducer = (state = [], action) => {
  switch (action.type) {
    case RELAY1_ON_OFF:
      state = action.onOf1;
      return state;
    default:
      return state;
  }
};

export default OnOffRelay1Reducer;
