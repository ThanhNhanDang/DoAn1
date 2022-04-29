#include <ArduinoJson.h>   // Khai báo sử dụng thư viện đọc chuỗi Json
#include "RSAAuth.h"       // Khai báo sử dụng thư viện RSA (Rx = D1, Tx = D 2)
#include "DHT.h"           // Khai báo sử dụng thư viện dht

#define DHTTYPE   DHT11    // Cảm biến sử dụng
#define DHTPin    13       // Chân cảm biến GPIO13 (D7)
#define BUTTON1   10       // Chân nút nhấn điều khiển đèn GPIO10 (SD3)
#define BUTTON2   9        // Chân nút nhấn điều khiển quạt GPIO9 (SD2)
#define WARNING   15       // Chân led và loa báo động GPIO15 (D8)
#define LED       14       // Chân thiết bị 1 (LED) GPIO14 (D5)
#define FAN       12       // Chân thiết bị 2 (FAN) GPIO12 (D6)
#define BAUD_RATE 9600     // Tốc độ giao tiếp UART 9600 bit/s

DHT dht(DHTPin, DHTTYPE);                // Cấu hình cảm biến DHT11 với chân data và loại cảm biến
DynamicJsonDocument doc(2048); // Khởi tạo document Jon động với dữ liệu được lưu trong bộ nhớ heap
// trong đề tài này chúng em sử dụng 2kb <=> 2028 byte
// khuyến khích document có kích thước lớn hơn 1kb

unsigned long TIME_SEND_DHT     = 5*1000;  // Cứ sau mỗi 5000ml (5s)
// sẽ gửi dữ liệu của cảm biến (nhiệt độ, độ ẩm)
// qua getWay để getWay pub lên broker
unsigned long TIME_MILLIS_DHT   = 0;       // Thời gian hiện tại của hàm millis(), dht

float tempMax   = 32;     // Khi nhiệt độ vượt quá tempMax thì hệ thống sẽ cảnh báo
// Quạt sẽ bật (người dùng sẽ không tắt được quạt), nếu quạt bật trong vòng 10s mà nhiệt độ vẫn không hạ thì
// Sẽ gửi hệ thống sẽ cảnh báo (chuông + led sẽ reo và sẽ gửi về email trong 1 khoản thời gian)
float tempMin   = 30;     // Nếu nhiệt độ dưới tempMin thì chuông và quạt sẽ tắt
float temp      = 0;         // Nhiệt độ gửi qua getway
float humid     = 0;        // Độ ẩm gửi qua getway

/////______Các biến cho việc gửi và nhận______/////
char  cstr[255];
byte  m[255];
byte  buff[255];
int   BEGIN=0;
int   END=0;
int   DesLen=0;
/////______Các biến cho việc gửi và nhận______/////

bool checkSend  = false;   // Kiểm tra việc gửi, để gửi một lần khi

unsigned long button1Millis = 0;       // Thời gian hiện tại của hàm millis(), button1
unsigned long button2Millis = 0;       // Thời gian hiện tại của hàm millis(), button2
unsigned long debounceDelay   = 20;      // Thời gian nhấn giữ của 2 nút nhấn

unsigned char onoff         = 1;       // Điều khiển thiết bị 1(Nếu = 0 thì tắt thiết bị, ngược lại = 1 thì bật thiết bị)
unsigned char onoff2        = 1;       // Điều khiển thiết bị 1(Nếu = 0 thì tắt thiết bị, ngược lại = 1 thì bật thiết bị)
unsigned char checkButton2  = 0;       // Nếu bằng 0 thì thiết bị 2 (quạt) tự động bật do nhiệt độ cao (lớn hơn tempMax)
// nên không được bật/tắt được bằng phần cứng, phải chờ cho nhiệt độ giảm xuống (nhỏ hơn tempMin) thì bằng 1
int btnState;
int lastBtnState  = HIGH;    // Trạng thái sau cùng của việc nút nhấn 1, và thiết bị 1
int btnState2;
int lastBtnState2 = HIGH;    // Trạng thái sau cùng của việc nút nhấn 2, và thiết bị 2

bool state1 = false;   // Trạng thái hiện tại của thiết bị (đèn) (false là đã bật, true là đã tắt)
bool state2 = false;   // Trạng thái hiện tại của thiết bị (quạt) (false là đã bật, true là đã tắt)

unsigned long warningTime         = 30000; // Thời gian giới hạn cho việc cảnh báo khi quạt bật mà nhiệt độ vẫn chưa giảm xuống nhỏ hơn tempMax
unsigned long startMillisTemp     = 0;     // Thời gian hiện tại của hàm millis(), khi mà quạt bật trong warningTime mà nhiệt độ chưa tắt
unsigned long time_millis_warning = 0;     // Thời gian hiện tại của hàm millis(), cảnh báo (chuông báo và đèn led chớp tắt mỗi 500ms)

void rsaSend();
void readStateRelay();
void guiDHT (int w);
void guiStateRelay (int idrl);
void request(String payload);
void button1();
void button2();
void readDHT();
void demo_TIMER(int w);

// Hàm này thực hiện việc gửi chuỗi Json qua getWay
void rsaSend()
{
    yield();         // Delay một khoản thời gian rất ngắn
    rsa.Send(cstr);
}

// Hàm này đọc trạng thái của thiết bị
void readStateRelay()
{
    lastBtnState = state1 = digitalRead(LED);
    lastBtnState2 = state2 = digitalRead(FAN);
}

// Hàm này gửi dữ liệu cảm biến và trạng thái của 2 thiết bị qua getWay
// Tham số truyền vào (w) thể hiện sự cảnh báo, nếu bằng 1 tức là nhiệt độ cao + quạt bật + nhiệt độ vẫn không hạ
// Bên getWay sẽ bắt giá trị này để gửi lên broker qua topic doan1/warning để hiển thị lên app + gmail
// Nếu w bằng 0 thì không cảnh báo
void guiDHT (int w)
{
    readDHT(); // Đọc giá trị cảm biến
    if (isnan(humid) || isnan(temp))
    {
        return;
    }
    readStateRelay();
    for(int i=0; i<100; i++) // vòng lặp chạy từ 0-99 để reset mảng cstr
        cstr[i]=0;
    sprintf(cstr,"{\"idgw\":1,\"t\":%.2f,\"h\":%.2f,\"iddv\":1,\"st1\":\"%s\",\"st2\":\"%s\",\"w\":%d}",
            temp,humid, state1 ? "OFF":"ON", state2 ? "OFF":"ON",w);

    rsaSend();
}

// Hàm này sẽ gửi chuỗi phản hồi lại khi thiết bị đã bật hoặc tắt lên broker để pub qua topic doan1/relay(1:2)/state
// Tham số truyền vào là ID của thiết bị
// Có một khóa là r, khóa này bằng 1 để khi qua bên getWay, getWay sẽ bắt điều kiện để gửi lên broker qua pub qua topic doan1/relay(1:2)/state
void guiStateRelay (int idrl)
{
    readStateRelay();
    if (isnan(humid) || isnan(temp))
    {
        return;
    }
    for(int i=0; i<100; i++)
        cstr[i]=0;
    sprintf(cstr,"{\"idgw\":1,\"t\":%.2f,\"h\":%.2f,\"iddv\":1,\"st1\":\"%s\",\"st2\":\"%s\",\"idrl\":%d,\"r\":1}",
            temp,humid, state1 ? "OFF":"ON", state2 ? "OFF":"ON", idrl);
    rsaSend();
}

// Hàm này sẽ xử lý sự kiện điều khiển thiết bị từ App
// Tham số truyền vào là chuỗi Json
void request(String payload)
{
    deserializeJson(doc, payload);         // Khởi tạo một document có kích thước động là 2kb để phân tích chuỗi Json truyền vào
    JsonObject obj = doc.as<JsonObject>(); // Tạo 1 obj có kiểu dữ liệu là JsonObject với document vừa tạo
    // Nếu muốn lấy giá trị của khóa nào thì chỉ việc obj[<tên khóa>]
    int IDRL = obj["idrl"];                // ID thiết bị
    int ID = obj["iddv"];                  // ID device
    int IDGW = obj["idgw"];                // ID getWay
    String con = obj["state"].as<String>();// control

    if(IDGW == 1 && ID ==1)  // Kiểm tra nếu IDGW là và gửi đúng ID của device thì mới thực hiện câu điều khiển thiết bị
    {
        switch(IDRL)
        {
        case LED:
        {
            if(con=="on")
            {
                digitalWrite(LED,0);
                onoff = 0;
                delay(100);
            }
            else
            {
                digitalWrite(LED,1);
                onoff = 1;
                delay(100);
            }
            guiStateRelay(IDRL);
            break;
        }
        case FAN:
        {
          if(checkButton2 != 0){
            if(con=="on")
            {
                digitalWrite(FAN,0);
                onoff2 = 0;
                delay(100);
            }
            else
            {
                digitalWrite(FAN,1);
                onoff2 = 1;
                delay(100);
            }
            guiStateRelay(IDRL);
          }
            break;
        }
        }
        
    }
}

//Hàm này điều khiển Led bằng button1
void button1()
{
    byte reading = digitalRead(BUTTON1);
    if (reading != lastBtnState)
        button1Millis = millis();
    if ((millis() - button1Millis) > debounceDelay)
    {
         if (reading != btnState) {
            btnState = reading;
            if (btnState == LOW)
            {
                onoff = (onoff == 0) ? 1 : 0;
                digitalWrite(LED, onoff);
                guiStateRelay(LED);
            }
        }
    }
    lastBtnState = reading;
}
//Hàm này điều khiển quạt bằng button2
void button2()
{
    byte reading = digitalRead(BUTTON2);
    if (reading != lastBtnState2)
        button2Millis = millis();
    if ((millis() - button2Millis) > debounceDelay)
    {
         if (reading != btnState2) {
            btnState2 = reading;
            if (btnState2 == LOW)
            {
                onoff2 = (onoff2 == 0) ? 1 : 0;
                digitalWrite(FAN, onoff2);
                guiStateRelay(FAN);
            }
        }
    }
    lastBtnState2 = reading;
}

// Hàm này đọc nhiệt độ độ ẩm từ cảm biến
void readDHT()
{
    humid = dht.readHumidity();                            // Đọc độ ẩm
    temp = dht.readTemperature();                          // Đọc nhiệt độ

    if (isnan(humid) || isnan(temp))
    {
        //Serial.println("Failed to read from DHT sensor!");
        return;
    }
    if(temp > tempMax )
    {
        digitalWrite(FAN, 0);
        checkButton2 = 0;
        onoff2 = 0;
        if(!checkSend)
        {
            guiStateRelay(FAN);
            checkSend = true;
        }
    }
    else if (temp < tempMin)
    {
        if(checkButton2 == 0)
        {
            digitalWrite(FAN, 1);
            digitalWrite(WARNING, 0);
            onoff2 = 1;
            if(checkSend)
            {
                guiStateRelay(FAN);
                checkSend = false;
            }
            checkButton2 = 1;
        }
    }
}

// hàm này sẽ gửi dữ liệu cảm biến và trạng thái thiết bị qua getWay mỗi 5s
void demo_TIMER(int w)
{
    if ( (millis() - TIME_MILLIS_DHT) >= TIME_SEND_DHT)
    {
        TIME_MILLIS_DHT = millis();
        guiDHT(w);
    }
}
void setup()
{
    //Serial.begin (BAUD_RATE);
    dht.begin();
    //----------
    swSer.begin(BAUD_RATE);         // Tốc độ giao tiếp UART giữa 2 esp 9600 bit/s

    pinMode(BUTTON1, INPUT);        // Cấu hình cho chân nút nhấn 1 là input
    pinMode(BUTTON2, INPUT);        // Cấu hình cho chân nút nhấn 2 là input
    pinMode(LED, OUTPUT);           // Cấu hình cho chân LED là output
    pinMode(FAN, OUTPUT);           // Cấu hình cho chân FAN là output
    pinMode(WARNING, OUTPUT);       // Cấu hình cho chân WARNING là output
    digitalWrite(LED,1);            // Cho chân LED là mức 1 => Tắt thiết bị
    digitalWrite(FAN,1);            // Cho chân FAN là mức 1 => Tắt thiết bị
    digitalWrite(WARNING,0);        // Cho chân WARNING là mức 0 => Tắt chuông và led báo động
    readStateRelay();               // Đọc trạng thái thiết bị
    readDHT(); // Đọc giá trị cảm biến
}
void loop()
{
    DesLen=0;
    if(rsa.Receive(buff,&BEGIN,&END,m,&DesLen)) // Nếu có dữ liệu từ getWay truyền qua
        // Nó sẽ kiểm tra dữ liệu nhận được đúng với dữ liệu mà getWay truyền qua
        // thì thực hiện điều khiển thiết bị
    {
        if(DesLen>0)
            request((char*)m);
    }
    button1();
    if(checkButton2 != 0){
       button2();
    }
  
    if (temp < tempMax)                 // Nếu nhiệt độ nhỏ hơn tempMax
    {
        startMillisTemp = millis();     // startMillisTemp bằng thời gian hiện tại
        digitalWrite(WARNING, 0);       // tắt báo động
        demo_TIMER(0);                  // gửi dữ liệu nhiệt độ, trạng thái thiết bị mỗi 5 giây
        // với tham số truyền vào là waring 0 là không báo động ngược lại 1 là báo động
    }
    else
    {
        if((unsigned long)millis() - startMillisTemp >= warningTime)  // Nhiệt độ vẫn trên mức báo động trong vòng warningTime
        {
            // thì cảnh báo thông báo đến người dùng
            if((unsigned long)millis() - time_millis_warning >= 500)    // Mỗi 500ms loa và Led sẽ thay đổi trạng thái
            {
                readDHT();
                if(digitalRead(WARNING) == 0)
                  digitalWrite(WARNING,1);
                
                else
                  digitalWrite(WARNING,0);
                
                demo_TIMER(1);
                time_millis_warning = millis();
            }
            

        }
        else demo_TIMER(0);
    }
}
