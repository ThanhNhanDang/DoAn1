var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://test.mosquitto.org', { clientId: 'mqttjs01' });
console.log('connected flag  ' + client.connected);
client.on('connect', function () {
  console.log('connected  ' + client.connected);
});

var message = 'test message';
var topic = 'testtopic';
//publish every 5 secs
var options = {
  retain: true,
  qos: 1
};
var timer_id = setInterval(function () {
  publish(topic, message, options);
}, 5000);

//publish function
function publish(topic, msg, options) {
  console.log('publishing', msg);
  if (client.connected == true) {
    client.publish(topic, msg, options);
  }
}

client.on('message', function (topic, message, packet) {
  console.log('message is ' + message);
  console.log('topic is ' + topic);
});
