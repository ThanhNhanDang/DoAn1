import { GET_ALL_DATA_RELAY1 } from '../const/index';

const Relay1Reducer = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_DATA_RELAY1:
      state = [...action.dataRelay1];
      return state;
    default:
      return state;
  }
};

export default Relay1Reducer;
