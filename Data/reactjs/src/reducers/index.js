import { combineReducers } from 'redux';
import UserAuthReducer from './UserAuthReducer';
import DhtChartReducer from './DhtChartReducer';
import DhtReducer from './DhtReducer';
import MessageMQTTReducer from './MessageMQTTReducer';
import OnOffRelay1Reducer from './OnOffRelay1Reducer';
import OnOffRelay2Reducer from './OnOffRelay2Reducer';
import Relay1Reducer from './Relay1Reducer';
import Relay2Reducer from './Relay2Reducer';
import EmailsReducer from './EmailsReducer';

export default combineReducers({
  relay1: Relay1Reducer,
  relay2: Relay2Reducer,
  onOffRelay1: OnOffRelay1Reducer,
  onOffRelay2: OnOffRelay2Reducer,
  dht: DhtReducer,
  message: MessageMQTTReducer,
  dhtChart: DhtChartReducer,
  userAuth: UserAuthReducer,
  emails: EmailsReducer
});
