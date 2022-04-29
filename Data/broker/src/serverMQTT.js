require("dotenv").config();
const axios = require("axios");
const aedes = require("aedes")({
  authenticate: (client, username, password, callback) => {
    console.log("username:" + username);
    callback(
      null,
      username == process.env.MQTT_USERNAME &&
        password == process.env.MQTT_PASSWORD
    );
  },
});
const server = require("net").createServer(aedes.handle);
const httpServer = require("http").createServer();
const port = 1883;
const wsPort = 8883;
let timeSendEmail = 0;
const tempMax = 32;
server.listen(port, function () {
  console.log("Ades MQTT listening on port: " + port);
});
//new

const addRelay1 = async (dataRelay) => {
  await axios
    .post(`${process.env.SERVER_EXPRESS}/doan1/relay1/add`, dataRelay)
    .then((res) => console.log(res.data));
};

const addRelay2 = async (dataRelay) => {
  await axios
    .post(`${process.env.SERVER_EXPRESS}/doan1/relay2/add`, dataRelay)
    .then((res) => console.log(res.data));
};

const sendEmail = async (email) => {
  await axios
    .post(`${process.env.SERVER_EXPRESS}/doan1/email/send`, email)
    .then((res) => console.log(res.data));
};

const addDht = async (dataDht) => {
  await axios
    .post(`${process.env.SERVER_EXPRESS}/doan1/dht11/add`, dataDht)
    .then((res) => console.log(res.data));
};

const getAllUserAndeSendEmail = async (topic, obj, today) => {
  await axios
    .get(`${process.env.SERVER_EXPRESS}/doan1/user/get-all`)
    .then((response) => {
      timeSendEmail++;
      if (timeSendEmail > 2) {
        response.data.forEach((user) => {
          // Esp 5s gửi lên broker 1 lần
          var email = {
            to: user.email,
            subject: "CẢNH BÁO NHIỆT ĐỘ VƯỢT MỨC QUY ĐỊNH !!!!",
            htmlContent:
              '<h1 style="color: red;">Cảnh báo</h1><br/><h2>HỆ THỐNG KHÔNG THỂ HẠ NHIỆT ĐỘ XUỐNG!!<br/> VUI LÒNG KIỂM TRA, HOẶC GỌI <a href="#">114</a> ĐỂ GIẢI QUYẾT KỊP THỜI</h2>',
            time: today,
            isUnRead: true,
            topic: topic,
          };
          sendEmail(email);
          timeSendEmail = 0;
        });
        if (timeSendEmail % 5 === 0) {
          var dataDht = {
            topic: topic,
            idgw: obj.idgw,
            temp: obj.t,
            humid: obj.h,
            warning: obj.t > tempMax ? true : false,
            time: today,
          };
          addDht(dataDht);
        }
      }
    });
};

const ws = require("websocket-stream");
ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(wsPort, function () {
  console.log("Aedes MQTT-WS listening on port: " + wsPort);
  aedes.publish({ topic: "aedes/hello", payload: "I'm broker " + aedes.id });
});

aedes.on("client", function (client) {
  console.log("new client", client.id);
});
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log(
      "message from client",
      client.id,
      packet.topic,
      packet.payload.toString()
    );
    const obj = JSON.parse(packet.payload.toString());
    var today = new Date().getTime();
    if (packet.topic === "doan1/warning") {
      getAllUserAndeSendEmail(packet.topic, obj, today);
    } else if (packet.topic === "doan1/relay1/state") {
      var dataRelay = {
        topic: packet.topic,
        idrl: obj.idrl,
        iddv: obj.iddv,
        idgw: obj.idgw,
        time: today,
        state: obj.st1,
      };
      addRelay1(dataRelay);
    } else if (packet.topic === "doan1/relay2/state") {
      var dataRelay = {
        topic: packet.topic,
        idrl: obj.idrl,
        iddv: obj.iddv,
        idgw: obj.idgw,
        time: today,
        state: obj.st2,
      };
      addRelay2(dataRelay);
    } else if (packet.topic === "doan1/dht11") {
      var dataDht = {
        topic: packet.topic,
        idgw: obj.idgw,
        temp: obj.t,
        humid: obj.h,
        warning: obj.t > tempMax ? true : false,
        time: today,
      };
      addDht(dataDht);
    }
  }
});

aedes.on("subscribe", function (subscriptions, client) {
  if (client) {
    console.log("subscribe from client", subscriptions, client.id);
  }
});
/////////////////////////////////////
