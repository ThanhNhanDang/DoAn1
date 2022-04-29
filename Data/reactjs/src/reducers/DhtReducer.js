import { GET_ALL_DATA_DHT } from '../const/index';

const DhtReducer = (state = [], action) => {
  switch (action.type) {
    case GET_ALL_DATA_DHT:
      state = [...action.dataDHT];
      return state;

    default:
      return state;
  }
};

export default DhtReducer;
