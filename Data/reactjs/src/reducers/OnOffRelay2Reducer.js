import { RELAY2_ON_OFF } from '../const/index';

const OnOffRelay2Reducer = (state = [], action) => {
  switch (action.type) {
    case RELAY2_ON_OFF:
      state = action.onOf2;
      return state;
    default:
      return state;
  }
};

export default OnOffRelay2Reducer;
