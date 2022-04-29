#include <ESP8266WiFi.h>                     // Khai báo xử dụng thư viện wifi của esp8266
#include <MQTT.h>                            // Khai báo xử dụng thư viện MQTT
#include "RSAAuth.h"                         // Khai báo sử dụng thư viện RSA (Rx = D1, Tx = D 2)
#include <ArduinoJson.h>                     // Khai báo sử dụng thư viện đọc chuỗi Json

#define mqtt_ip   "192.168.43.32"            // IP của broker MQTT
#define mqtt_user "ThanhNhanViTuong"         // Tài khoản đăng nhập broker
#define mqtt_pwd  "doan1thanhnhanvituong"    // Mật khẩu đăng nhập broker
#define ssid      "NhanSgu"                  // ssid của wifi
#define pass      "123456789"                // mật khẩu của wifi
#define BAUD_RATE 9600                       // Tốc độ giao tiếp UART 9600 bit/s
DynamicJsonDocument doc(2048); // Khởi tạo document Jon động với dữ liệu được lưu trong bộ nhớ heap
// trong đề tài này chúng em sử dụng 2kb <=> 2028 byte
// khuyến khích document có kích thước lớn hơn 1kb

WiFiClient espClient;       // Biến espClient dùng để kết nối với wifi
MQTTClient client;          // Biến client dùng để kết nối với broker

char  r;                     // Nếu biến này bằng 1 sẽ pub lên topic doan1/relay(1:2)/state
int   idrl;                  // id của thiết bị
int   iddv;                  // id của device
int   idgw;                  // id của getway
char  w;                     // Nếu biến này bằng 1 sẽ pub lên topic doan1/waring

/////______Các biến cho việc gửi và nhận______/////
char  cstr[255];
byte  m[255];
byte  buff[255];
int   BEGIN=0;
int   END=0;
int   DesLen=0;
/////______Các biến cho việc gửi và nhận______/////

void setup_wifi();
void callback(String topic, String payload);
void reconnect();
void request(String payload);

// Hàm kết nối wifi
void setup_wifi()
{
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, pass);                 // Cấu hình ssid, và mật khẩu cho wifi
    while (WiFi.status() != WL_CONNECTED)   // Chờ cho kết nối thành công
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());         // Địa chỉ IP của module esp8266 sau khi đã kết nối được vào mạng wifi
}

// Hàm này sẽ được thực hiện khi người dùng gửi dữ liệu điều khiển thiết bị lên broker qua topic doan1/relay
// Tham số đầu tiên là topic, tham số thứ hai là tải
void callback(String topic, String payload)
{ 
    deserializeJson(doc, payload);          // Khởi tạo một document có kích thước động là 2kb để phân tích chuỗi Json truyền vào
    JsonObject obj = doc.as<JsonObject>();  // Tạo 1 obj có kiểu dữ liệu là JsonObject với document vừa tạo

    // muốn lấy giá trị của khóa nào thì chỉ việc obj[<tên khóa>]
    iddv = obj["iddv"];                  // ID device
    idgw = obj["idgw"];                // ID getWay
    if(idgw == 1 && iddv==1)
    {
        for(int i=0; i<payload.length(); i++) // vòng lặp chạy từ 0-độ dài của chuỗi payload để reset mảng cstr
            cstr[i]=0;
        payload.toCharArray(cstr,payload.length());     // Chuyển kiểu String qua kiểu *char để gửi qua device điều khiển thiết bị
        yield();                                        // Delay một khoản thời gian rất ngắn
        rsa.Send(cstr);                                 // Gửi chuỗi cstr qua device
        Serial.println("-Gui:");
        Serial.println((char*)cstr);
    }
}

// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect()
{
    // Chờ tới khi kết nối
    while (!client.connected())                                       //Nếu chưa kết nối
    {

        if (client.connect("ESP8266Client",mqtt_user, mqtt_pwd))        // Tham số thứ nhất là tên người dùng
        {
            // Tham số thứ 2 là tài khoản, tham số thứ 3 là mật khẩu
            Serial.print("MQTT connection...");
            // Thực hiện kết nối với mqtt user và pass
            Serial.println("connected");
            client.subscribe("doan1/relay");                              // Sub vào kênh relay để nhận lệnh điều khiển từ App
        }
        else
        {
            Serial.print("That bai");
            Serial.println("Thu lai sau 5s");
            // Đợi 5s
            delay(5000);
        }
    }
}

void request(String payload)
{
    deserializeJson(doc, payload);
    JsonObject obj = doc.as<JsonObject>();
    r = obj["r"];
    w = obj["w"];
    idrl = obj["idrl"];
    iddv = obj["iddv"];
    idgw = obj["idgw"];
}
void setup()
{
    Serial.begin(BAUD_RATE);    // Tốc độ giao tiếp với máy tính
    swSer.begin(BAUD_RATE);     // Tốc độ giao tiếp UART giữa 2 esp 9600 bit/s
    setup_wifi();
    client.begin(mqtt_ip, espClient);      // Cấu hình ib của broker thông qua mạng wifi để kết nối vào broker
    client.onMessage(callback);            // Mỗi lần app pub một gói tin thì hàm này sẽ nhận và gọi hàm callback để xử lý
    reconnect();                           // Kết nối vào broker
}
void loop()
{
    client.loop();                         // client mqtt luôn sẵn sàng cho việc pus sub
    if (!client.connected())               // Nếu chưa kết nối thì gọi hàm kết nối
    {
        reconnect();
    }

    DesLen=0;
    if(rsa.Receive(buff,&BEGIN,&END,m,&DesLen)) // Nếu có dữ liệu từ device truyền qua
        // Nó sẽ kiểm tra dữ liệu nhận được đúng với dữ liệu mà device truyền qua
        // thì thực hiện pub lên broker
    {
        if(DesLen>0)
        {
            request((char*)m);                  // Lấy các biến cần thiết trong gói tin khi thực hiện hàm request

            if(idgw == 1 && iddv == 1)
            {

                Serial.print("-Nhan tu DV ");
                Serial.println(iddv);
                Serial.println((char*)m);
                Serial.println("===========================================================");
                //xử lý đưa gói tin phản hồi thiết bị 1 lên Broker ở đây
                if(r==1 && idrl==14)
                {
                    client.publish("doan1/relay1/state",(char*)m);
                    return;
                }
                //xử lý đưa gói tin phản hồi thiết bị 2 lên Broker ở đây
                if(r==1 && idrl==12)
                {
                    client.publish("doan1/relay2/state",(char*)m);
                    return;
                }
                //xử lý đưa gói tin cảnh báo lên Broker ở đây
                if(w==1)
                {
                    client.publish("doan1/warning",(char*)m);
                    return;
                }

                //xử lý đưa gói tin nhiệt độ độ ẩm và trạng thái 2 thiết bị lên Broker ở đây
                client.publish("doan1/dht11",(char*)m);
            }
        }
    }
    else Serial.println("Nhan error:");

}
