#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define LORA_SCK 5
#define LORA_MISO 19
#define LORA_MOSI 27
#define LORA_SS 18
#define LORA_DI0 26
#define LORA_RST 23

// Wi-Fi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* endpoint = "https://final-work-5-frww.onrender.com/api/cats";

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 5000);

  Serial.println("T-Beam Binary Receiver with Wi-Fi POST");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // LoRa setup
  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  pinMode(LORA_RST, OUTPUT);
  digitalWrite(LORA_RST, LOW);
  delay(10);
  digitalWrite(LORA_RST, HIGH);
  delay(10);

  LoRa.setPins(LORA_SS, LORA_RST, LORA_DI0);
  if (!LoRa.begin(868E6)) {
    Serial.println("LoRa init failed!");
    while (true);
  }
  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);

  Serial.println("Receiver ready...");
}

void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize == 13) {
    uint8_t buffer[13];
    for (int i = 0; i < 13; i++) buffer[i] = LoRa.read();

    int32_t lat_i, lon_i;
    uint16_t movementSum, lux;
    uint8_t flags;

    memcpy(&lat_i, buffer, 4);
    memcpy(&lon_i, buffer + 4, 4);
    memcpy(&movementSum, buffer + 8, 2);
    memcpy(&lux, buffer + 10, 2);
    flags = buffer[12];

    float lat = lat_i / 1000000.0;
    float lon = lon_i / 1000000.0;
    bool sleeping = flags & 0b001;
    uint8_t status = (flags >> 1) & 0b11;

    Serial.println("Decoded Packet:");
    Serial.printf("Lat: %.6f Lon: %.6f\n", lat, lon);
    Serial.printf("Movement: %d Lux: %d\n", movementSum, lux);
    Serial.printf("Sleeping: %d Status: %d\n", sleeping, status);
    Serial.printf("RSSI: %d\n", LoRa.packetRssi());
    Serial.println("---------------------");

    // Send POST request
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(endpoint);
      http.addHeader("Content-Type", "application/json");

      String payload = "{";
      payload += "\"latitude\":" + String(lat, 6) + ",";
      payload += "\"longitude\":" + String(lon, 6) + ",";
      payload += "\"movement\":" + String(movementSum) + ",";
      payload += "\"lux\":" + String(lux) + ",";
      payload += "\"sleeping\":" + String(sleeping ? "true" : "false") + ",";
      payload += "\"status\":" + String(status);
      payload += "}";

      int httpResponseCode = http.POST(payload);
      if (httpResponseCode > 0) {
        Serial.printf("POST response code: %d\n", httpResponseCode);
      } else {
        Serial.printf("Error on POST: %s\n", http.errorToString(httpResponseCode).c_str());
      }
      http.end();
    }
  } else if (packetSize > 0) {
    Serial.printf("Unexpected packet size: %d\n", packetSize);
  }

  delay(100); // todo: try to prevent loop, might need a bigger delay?
}
