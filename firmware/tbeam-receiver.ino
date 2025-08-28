#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <HTTPClient.h>

// --- LoRa Pins ---
#define LORA_SCK 5
#define LORA_MISO 19
#define LORA_MOSI 27
#define LORA_SS 18
#define LORA_DI0 26
#define LORA_RST 23

// --- WiFi credentials ---
const char* ssid = "iPhone van Filip";
const char* password = "wachtwoord";

// --- Backend URLs ---
const char* catServerURL = "https://final-work-5-frww.onrender.com/api/cats";
const char* buzzerServerURL = "https://final-work-5-frww.onrender.com/api/buzzer/status";


unsigned long lastBuzzerCheck = 0;
const unsigned long buzzerInterval = 2000;

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 5000);

  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected!");

  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, LOW);
  delay(10);
  digitalWrite(LORA_RST, HIGH);
  delay(10);

  LoRa.setPins(LORA_SS, LORA_RST, LORA_DI0);
  if (!LoRa.begin(868E6)) { Serial.println("LoRa init failed!"); while (true); }

  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);

  Serial.println("Receiver ready...");
}

void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize == 18) {  
    uint8_t buffer[18];
    for (int i = 0; i < 18; i++) buffer[i] = LoRa.read();

    int32_t lat_i, lon_i;
    uint16_t movementSum, lux, sleepTime, jumps;
    uint8_t flags, battery;

    memcpy(&lat_i, buffer, 4);
    memcpy(&lon_i, buffer + 4, 4);
    memcpy(&movementSum, buffer + 8, 2);
    memcpy(&lux, buffer + 10, 2);
    flags = buffer[12];
    battery = buffer[13];
    memcpy(&sleepTime, buffer + 14, 2);
    memcpy(&jumps, buffer + 16, 2);

    float lat = lat_i / 1000000.0;
    float lon = lon_i / 1000000.0;
    uint8_t statusVal = (flags >> 1) & 0b11;

    String status;
    switch(statusVal) {
      case 0: status = "nieuwsgierig"; break;
      case 1: status = "chill"; break;
      case 2: status = "probleem"; break;
      default: status = "chill"; break;
    }

    String environment = (lux > 100) ? "outdoors" : "indoors";

    Serial.println("Decoded Packet:");
    Serial.print("Lat: "); Serial.print(lat,6);
    Serial.print(" Lon: "); Serial.print(lon,6);
    Serial.print(" Movement: "); Serial.print(movementSum);
    Serial.print(" Lux: "); Serial.print(lux);
    Serial.print(" Battery: "); Serial.println(battery);
    Serial.print(" Sleep: "); Serial.print(sleepTime);
    Serial.print(" Jumps: "); Serial.println(jumps);
    Serial.print(" Status: "); Serial.print(status);
    Serial.print(" Env: "); Serial.println(environment);
    Serial.println("---------------------");


    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(catServerURL);
      http.addHeader("Content-Type", "application/json");

      String json = "{";
      json += "\"name\":\"Cat_1\",";
      json += "\"ownerId\":\"12345\",";
      json += "\"activityLevel\":" + String(movementSum) + ",";
      json += "\"location\":{\"latitude\":" + String(lat,6) + ",\"longitude\":" + String(lon,6) + "},";
      json += "\"status\":\"" + status + "\",";
      json += "\"battery\":" + String(battery) + ",";
      json += "\"environment\":\"" + environment + "\",";
      json += "\"sleep\":" + String(sleepTime) + ",";
      json += "\"jumps\":" + String(jumps);
      json += "}";

      int code = http.POST(json);
      Serial.printf("POST Response: %d\n", code);
      if (code > 0) Serial.println("Server Response: " + http.getString());
      http.end();
    }
  } else if (packetSize > 0) {
    Serial.printf("Unexpected packet size: %d\n", packetSize);
  }


  if (millis() - lastBuzzerCheck > buzzerInterval) {
    lastBuzzerCheck = millis();
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(buzzerServerURL);
      int code = http.GET();
      if (code == 200) {
        String payload = http.getString();
        if (payload.indexOf("\"buzz\":true") >= 0) {
          Serial.println("Sending buzzer trigger to CubeCell...");
          LoRa.beginPacket();
          LoRa.write(0x01);
          LoRa.endPacket();
        }
      }
      http.end();
    }
  }
}
