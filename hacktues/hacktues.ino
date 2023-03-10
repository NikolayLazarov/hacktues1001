
// Sensor Libraries
#include <DHT.h>
// #include <DHT_U.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#define REPORTING_PERIOD_MS     1000
 // Sensor DATA
 int temp_data;
 int oxygen_data;
 int pulse_data;

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
char jsonOutput_api[256];

// HTTP Libraries and constants
#include "HTTPClient.h"
#include "mbedtls/md.h"
// #include "mbedtls/base64.h"

// #include "LiquidCrystal.h"
PulseOximeter pox;
uint32_t tsLastReport = 0;
 
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
  connectToWifi();
    Serial.print("Initializing pulse oximeter..");
 
    // Initialize the PulseOximeter instance
    // Failures are generally due to an improper I2C wiring, missing power supply
    // or wrong target chip
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
  /*
    pox.update();
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
        Serial.print("Heart rate:");
        Serial.print(pox.getHeartRate());
        Serial.print("bpm / SpO2:");
        Serial.print(pox.getSpO2());
        Serial.println("%");
 
        tsLastReport = millis();
  }
  */
  if(WiFi.status() == WL_CONNECTED)
  {
    HTTPClient client;
    client.begin("http://10.1.186.33:3000/m"); 
    client.addHeader("Content-Type", "application/json");

     const size_t CAPACITY = JSON_OBJECT_SIZE(4);
     StaticJsonDocument<CAPACITY> doc_private;
    // jsonOutput_private = '{\"name\":"+String(USER_NAME)+",\"egn\":"+String(USER_EGN)+",\"password\":"+String(USER_PASSWORD)+",\"id\":"+String(USER_ID)}';


    JsonObject object_private = doc_private.to<JsonObject>();
    object_private["name"] = USER_NAME;
    object_private["id"] = USER_ID;
    object_private["password"] = USER_PASSWORD;
    object_private["egn"] = USER_EGN;
    /*
    Serial.print("Name: ");
    Serial.println(USER_NAME);unable to find string literal operator 'operator""name' with 'const char [3]', 'unsigned int' arguments
    Serial.print("EGN: ");
    Serial.println(USER_EGN);
    Serial.print("PASSWORD: ");
    Serial.println(USER_PASSWORD);
    Serial.print("ID: ");
    Serial.println(USER_ID);
     */ 
    serializeJson(doc_private, jsonOutput_private);

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
    Serial.println("Hash: ");
    String hash = "";
    for(int i= 0; i< sizeof(shaResult); i++)
  {
    //hash += String((int)shaResult[i],HEX);
    // Serial.println(stringOne);
     char str[3];
     sprintf(str, "%02x", (int)shaResult[i]);
     
     hash += str;
  }
  
  Serial.println(hash);

  

    //JsonObject object_api = doc_api.to<JsonObject>();
    //object_api["hash"] = hash;
    //object_api["temperature"] = temp_data;
    //object_api["oxygen"] = oxygen_data;
    //object_api["pulse"] = pulse_data;

    //serializeJson(doc_api, jsonOutput_api);
    //Serial.println("JSON OUTPUT");    
    //Serial.println(jsonOutput_api);
    String jsonOutput = "{\"hash\":\""+String(hash)+"\",\"temperature\":\""+String(temp_data)+"\",\"oxygen\":\""+String(oxygen_data)+"\",\"pulse\":\""+String(pulse_data)+"\"}";

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
}


