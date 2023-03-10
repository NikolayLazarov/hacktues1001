
// Sensor Libraries
#include <DHT.h>
#include <DHT_U.h>
#define DHTPIN 4
#define DHTTYPE 22

DHT dht(DHTPIN, DHTTYPE);

#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#define REPORTING_PERIOD_MS  1000
#define SENSOR_WORKTIME 10000
 // Sensor DATA
 float temp_data;
 int oxygen_data;
 int pulse_data;
 
// BUTTON CONSTANTS
 #define BUTTON_PIN 21  // GIOP21 pin connected to button

// Variables will change:
int lastState = LOW;  // the previous state from the input pin
int currentState; 
int countButton = 0;

// Json libraries and constants
 #include <ArduinoJson.h>
// SENSITIVE HASHING DATA
 #define USER_NAME "Gosho"
 #define USER_EGN  "978156823"
 #define USER_PASSWORD "1234"
 #define USER_ID "4321"


//Wifi Libraries and constants

#include "WiFi.h"
#define WIFI_NETWORK "InnovationForumGuests"
#define WIFI_PASSWORD ""
#define TIMEOUT 2000
char jsonOutput_private[256];

// HTTP Libraries and constants
#include "HTTPClient.h"
#include "mbedtls/md.h"
// #include "mbedtls/base64.h"

// #include "LiquidCrystal.h"
PulseOximeter pox;
uint32_t tsLastReport = 0;


 
float max(float* data, unsigned int size)
{
  float max = data[0];
  for(int i = 0;i<size;i++)
    {
      if(max < data[i])
        max = data[i];
    }
    Serial.println(max);
    return max;
}

float oxygen()
{
  delay(5000);
  int timer = millis();
  float data[60];
  int count = 0;
  int i =0;
  while(count != 60)
  {
    pox.update();
    if(millis() - tsLastReport > REPORTING_PERIOD_MS){
    data[i] = pox.getSpO2();
    Serial.print("Sp02: ");
    Serial.print(data[i]);
    Serial.println("%");
    count++;
    i++;
    tsLastReport = millis();
    }
  }
  
   return max(data,count);
}

float pulse()
{
  delay(5000);
  pox.update();
  float pulse_data;
  float data[60];
  int count = 0;
  int i = 0;
  while(count != 60)
  {
    pox.update(); 
    if(millis() - tsLastReport > REPORTING_PERIOD_MS){ 
        data[i] = pox.getHeartRate();
        Serial.print("Heart rate:");
        Serial.println(data[i]);
        count++;
        i++;
        tsLastReport = millis();
    }
  }
  
  return max(data,count);
}

float temperature()
{
  delay(4000);
  float temperature;
  int timer = millis();
  float data[60];
  int count = 0;
  int i = 0;
  while(count != 60)
  {
        data[i] = dht.readTemperature();
        Serial.print("TEMP:");
        Serial.println(data[i]);
        count++;
        i++;
        delay(1000);
  }
  
  return max(data,count);
}

void sendData()
{
    if(WiFi.status() == WL_CONNECTED)
  {
    HTTPClient client;
    String date;
    client.begin("http://10.1.186.33:3000/date"); // "http://10.1.186.33:3000/m"
    int httpCodeGet = client.GET();
    if(httpCodeGet > 0)
    {
      String payload_get = client.getString();
      Serial.println("\nStatusCode: " + String(httpCodeGet));
      Serial.print(payload_get);

      date = payload_get;

      client.end();
    }
    else
    {
      Serial.println("Failure at HTTP Request.");
    }

    
    client.begin("http://10.1.186.33:3000/m");
    client.addHeader("Content-Type", "application/json");

     const size_t CAPACITY = JSON_OBJECT_SIZE(4);
     StaticJsonDocument<CAPACITY> doc_private;
    // jsonOutput_private = '{\"name\":"+String(USER_NAME)+",\"egn\":"+String(USER_EGN)+",\"password\":"+String(USER_PASSWORD)+",\"id\":"+String(USER_ID)}';


    JsonObject object_private = doc_private.to<JsonObject>();
    object_private["name"] = USER_NAME;
    object_private["date"] = date;
    object_private["password"] = USER_PASSWORD;
    object_private["egn"] = USER_EGN;
    serializeJson(doc_private, jsonOutput_private);

    Serial.println(jsonOutput_private);

    const char* payload_private = jsonOutput_private;
    byte shaResult[32];

    mbedtls_md_context_t ctx;
    mbedtls_md_type_t md_type = MBEDTLS_MD_SHA256;

    const size_t payloadLength = strlen(payload_private);

    mbedtls_md_init(&ctx);
    mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type), 0);
    mbedtls_md_starts(&ctx);
    mbedtls_md_update(&ctx, (const unsigned char *) payload_private, payloadLength);
    mbedtls_md_finish(&ctx, shaResult);
    mbedtls_md_free(&ctx);

    //unsigned char output[64];
    //size_t outlen;
    //mbedtls_base64_encode(output, 64, &outlen, shaResult, strlen(reinterpret_cast<const char*>(shaResult)));

    // const unsigned char *hash = reinterpret_cast<const unsigned char*>(shaResult);

    const size_t CAPACITY_API = JSON_OBJECT_SIZE(4);
    StaticJsonDocument<CAPACITY_API> doc_api;
    String hash = "";
    for(int i= 0; i< sizeof(shaResult); i++)
  {
    //hash += String((int)shaResult[i],HEX);
    // Serial.println(stringOne);
     char str[3];
     sprintf(str, "%02x", (int)shaResult[i]);
     
     hash += str;
  }
    String jsonOutput = "{\"hash\":\"0x"+String(hash)+"\",\"temperature\":\""+String(temp_data)+"\",\"oxygen\":\""+String(oxygen_data)+"\",\"pulse\":\""+String(pulse_data)+"\"}";

    Serial.println(jsonOutput);

    int httpCode = client.POST(jsonOutput);

    if(httpCode > 0)
    {
      String payload = client.getString();
      Serial.println("\nStatusCode: " + String(httpCode));
      Serial.print(payload);
      client.end();
    }
    else
    {
      Serial.println("Failure at HTTP Request.");
    }
  }
  delay(100000000);
}



void onBeatDetected()
{
    Serial.println("Beat!");
}
// Wifi connection function
void connectToWifi()
{
  Serial.println("Connecting to Wifi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_NETWORK);
  unsigned long int attemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && attemptTime - TIMEOUT > 0) {
    Serial.print('.');
    delay(1000);
  }
  if(WiFi.status() == WL_CONNECTED)
  { 
    Serial.println("Connected!");
    // digitalWrite(LED_WIFI_PIN, HIGH);
    Serial.println(WiFi.localIP());
  }
  else
  {
    Serial.println("Failed!");
  }
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Initializing button...");
  //pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.println("Initializing DHT...");  
  dht.begin();
  connectToWifi();
  pox.begin();
  Serial.print("Initializing pulse oximeter..");
  if (!pox.begin()) {
        Serial.println("FAILED");
        for(;;);
    } else {
        Serial.println("SUCCESS");
    }
     pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
 
    // Register a callback for the beat detection
    pox.setOnBeatDetectedCallback(onBeatDetected);
 

  }  

void loop()
{
    //currentState = digitalRead(BUTTON_PIN);
    
    //if (lastState == HIGH && currentState == LOW && countButton == 0)
    //{
      Serial.println("Button clicked!");
      Serial.println("Temperature...");
      temp_data = temperature();
      //countButton++;
    //}
    //else if (lastState == HIGH && currentState == LOW && countButton == 1)
    //{
      Serial.println("Button clicked!");
      Serial.println("Pulse...");  
      pulse_data = pulse();  
      //countButton++;      
    //}
    //else if (lastState == HIGH && currentState == LOW && countButton == 2)
    //{
      Serial.println("Button clicked!");
      Serial.println("Oxygen...");
      oxygen_data = oxygen();      
    //  countButton++;
    //}
    //else if (lastState == LOW && currentState == HIGH)
      Serial.println("The button is released");
    //if(countButton == 3)
    //{
      sendData();
      return;
    //}
    //lastState = currentState;
}
