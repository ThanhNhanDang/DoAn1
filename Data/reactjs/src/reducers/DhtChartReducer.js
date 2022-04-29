import { GET_DATA_DHT_CHART } from '../const/index';

const DhtChartReducer = (state = [], action) => {
  switch (action.type) {
    case GET_DATA_DHT_CHART:
      state = [...action.dataDHTChart];
      return state;

    default:
      return state;
  }
};

export default DhtChartReducer;
