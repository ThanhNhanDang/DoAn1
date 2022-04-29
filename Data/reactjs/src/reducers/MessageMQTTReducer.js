import { MESSAGE_MQTT } from '../const/index';

const MessageMQTTReducer = (state = {}, action) => {
  switch (action.type) {
    case MESSAGE_MQTT:
      return action.message;

    default:
      return state;
  }
};

export default MessageMQTTReducer;
