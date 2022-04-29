import { GET_ALL_DATA_RELAY2 } from '../const/index';

const Relay2Reducer = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_DATA_RELAY2:
      state = [...action.dataRelay2];
      return state;
    default:
      return state;
  }
};

export default Relay2Reducer;
