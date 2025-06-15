#include <Wire.h>
#include <XPowersLib.h>
#include <TinyGPSPlus.h>
#include <MPU6050.h>
#include <WiFi.h>
#include <HTTPClient.h>


XPowersAXP2101 PMU;
#define PMU_I2C_ADDRESS 0x34
#define GPS_RX 34
#define GPS_TX 12
HardwareSerial gpsSerial(1);
TinyGPSPlus gps;
MPU6050 mpu;

// Wi‑Fi credentials
const char* ssid     = "";
const char* password = "";

// Motion detection variables
const float accelScale = 16384.0; 
const float jumpThreshold = 1.5;  
int jumpCount = 0;
bool inJump = false;

void setup() {
  Serial.begin(115200);
  delay(500);
  Wire.begin();

  // PMU setup
  if (!PMU.begin(Wire, PMU_I2C_ADDRESS, SDA, SCL)) {
    Serial.println("❌ PMU init failed");
    while (1);
  }
  PMU.enableDC1();
  PMU.enableDC3();
  PMU.enableALDO3(); PMU.setALDO3Voltage(3300);
  PMU.enableALDO2(); PMU.setALDO2Voltage(3300);
  Serial.println("⚡ PMU ready");

  // GPS
  gpsSerial.begin(115200, SERIAL_8N1, GPS_RX, GPS_TX);
  Serial.println("📡 GPS started");

  // MPU6050
  mpu.initialize();
  if (mpu.testConnection()) Serial.println("✅ MPU6050 OK");
  else Serial.println("❌ MPU6050 FAIL");

  // Wi‑Fi
  WiFi.begin(ssid, password);
  Serial.print("🔌 Connecting to Wi‑Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\n✅ Connected: " + WiFi.localIP().toString());
}

void loop() {
  // Read GPS
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  // Read MPU6050
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // Convert to g's
  float af = ax / accelScale;
  float bf = ay / accelScale;
  float cf = az / accelScale;
  float movement = sqrt(af*af + bf*bf + cf*cf);

  // Detect jumps
  if (bf > jumpThreshold && !inJump) {
    jumpCount++;
    inJump = true;
  } else if (bf < 0.2) {
    inJump = false;
  }

  // If GPS fix & Wi‑Fi OK → send data
  if (gps.location.isUpdated()) {
    Serial.printf("📍 Lat: %.6f Lng: %.6f\n", gps.location.lat(), gps.location.lng());
    Serial.printf("⚙️ Movement: %.3fg, Jumps: %d\n", movement, jumpCount);

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin("https://final-work-7cqh.onrender.com/api/cat-locations");
      http.addHeader("Content-Type", "application/json");

      String json = String(R"({)") +
        "\"latitude\":" + String(gps.location.lat(), 6) + "," +
        "\"longitude\":" + String(gps.location.lng(), 6) + "," +
        "\"movement\":" + String(movement, 3) + "," +
        "\"jumps\":" + String(jumpCount) +
        "}";
      int code = http.POST(json);

      Serial.println("➡️ " + json);
      if (code > 0) {
        Serial.println("HTTP code: " + String(code));
        Serial.println("Response: " + http.getString());
      } else {
        Serial.println("❗ POST error: " + String(code));
      }
      http.end();
    } else {
      Serial.println("❌ Wi‑Fi down – cannot send");
    }
  }

  // Output sat info & HDOP
  Serial.printf("🛰 Sats: %d HDOP: %.2f\n", gps.satellites.value(), gps.hdop.hdop());
  delay(10000);
}
