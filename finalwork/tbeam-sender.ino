#include <XPowersLib.h>
#include <TinyGPSPlus.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>

// Wi‑Fi credentials
const char* ssid     = "";
const char* password = "";

// Endpoint URL
const char* serverUrl = "/api/cat-locations";

// GPS setup
XPowersAXP2101 PMU;
#define PMU_I2C_ADDRESS 0x34
#define GPS_RX 34
#define GPS_TX 12
HardwareSerial gpsSerial(1);
TinyGPSPlus gps;

unsigned long lastPost = 0;
const unsigned long POST_INTERVAL = 10000; // every 10 seconds

void setup() {
  Serial.begin(115200);
  delay(500);

  Wire.begin();
  if (!PMU.begin(Wire, PMU_I2C_ADDRESS, SDA, SCL)) {
    Serial.println("🔌 PMU init failed");
    while (1);
  }
  PMU.enableDC1(); PMU.enableDC3();
  PMU.enableALDO3(); PMU.setALDO3Voltage(3300);
  PMU.enableALDO2();  // enable GPS power

  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);
  Serial.println("✅ GPS serial initialized");

  WiFi.begin(ssid, password);
  Serial.print("🌐 Connecting to Wi‑Fi");
  unsigned long t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 10000) {
    Serial.print('.');
    delay(500);
  }
  if (WiFi.status() == WL_CONNECTED)
    Serial.printf("\n✅ Connected: %s\n", WiFi.localIP().toString().c_str());
  else
    Serial.println("\n❌ Wi‑Fi failed");
}

void loop() {
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  if (gps.location.isUpdated()) {
    double lat = gps.location.lat();
    double lng = gps.location.lng();
    Serial.printf("📍 New GPS fix: %.6f, %.6f\n", lat, lng);

    if (millis() - lastPost > POST_INTERVAL && WiFi.status() == WL_CONNECTED) {
      lastPost = millis();
      StaticJsonDocument<200> doc;
      doc["latitude"]  = lat;
      doc["longitude"] = lng;
      String payload;
      serializeJson(doc, payload);

      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      int code = http.POST(payload);
      Serial.printf("📤 POST code: %d\n", code);
      http.end();
    }
  } else {
    Serial.println("⏳ Waiting for GPS fix...");
  }
}