#include "LoRaWan_APP.h"
#include "GPS_Air530Z.h"
#include <Wire.h>

// --- LoRa config ---
#define RF_FREQUENCY        868000000
#define TX_OUTPUT_POWER     14
#define LORA_BANDWIDTH      0
#define LORA_SPREADING_FACTOR 7
#define LORA_CODINGRATE     1
#define LORA_PREAMBLE_LENGTH 8

// --- Sleep/GPS ---
#define GPS_TIMEOUT         20000
#define GPS_CONTINUE_TIME   5000
#define SLEEP_INTERVAL      60000

// --- Battery config ---
#define BATTERY_PIN         ADC 
#define FULL_VOLTAGE        4.2 
#define EMPTY_VOLTAGE       3.3 
#define VOLTAGE_DIVIDER     2.0 

// --- Sensor addresses ---
#define BH1750_ADDRESS      0x23
#define BH1750_CONTINUOUS_HIGH_RES_MODE 0x10

// --- Globals ---
RadioEvents_t RadioEvents;
Air530ZClass GPS;
TimerEvent_t wakeTimer;

double latitude = 0.0;
double longitude = 0.0;
float lux = 0.0;
uint16_t movementSum = 0;
uint8_t flags = 0;  // bit0: sleep, bit1-2: status
uint8_t batteryPercent = 0;
float batteryVoltage = 0.0;

void VextON(void) { pinMode(Vext, OUTPUT); digitalWrite(Vext, LOW); }
void VextOFF(void) { pinMode(Vext, OUTPUT); digitalWrite(Vext, HIGH); }

// read battery
void readBattery() {
  int adcValue = analogRead(BATTERY_PIN);
  
  batteryVoltage = (adcValue * 3.3 / 4095.0) * VOLTAGE_DIVIDER;
  
  // Calculate battery percentage 
  batteryPercent = constrain(
    (int)((batteryVoltage - EMPTY_VOLTAGE) / (FULL_VOLTAGE - EMPTY_VOLTAGE) * 100),
    0, 100
  );
  
  Serial.printf("Battery: %.2fV (%d%%)\n", batteryVoltage, batteryPercent);
}

// Function to read light sensor (BH1750)
float readLightSensor() {
  Wire.beginTransmission(BH1750_ADDRESS);
  Wire.write(BH1750_CONTINUOUS_HIGH_RES_MODE);
  Wire.endTransmission();
  delay(180); // Wait for measurement
  
  Wire.requestFrom((uint16_t)BH1750_ADDRESS, (uint8_t)2, (bool)true);
  if (Wire.available() == 2) {
    uint16_t value = Wire.read() << 8 | Wire.read();
    return value / 1.2; // Convert to lux
  }
  return 0.0;
}

// Function to read MPU6050 accelerometer
void readMPU6050(float &ax, float &ay, float &az) {

  Wire.beginTransmission(0x68);
  Wire.write(0x6B); 
  Wire.write(0);    
  Wire.endTransmission(true);
  
  // Read accelerometer data
  Wire.beginTransmission(0x68);
  Wire.write(0x3B); 
  Wire.endTransmission(false);
  
  Wire.requestFrom((uint16_t)0x68, (uint8_t)6, (bool)true);
  
  int16_t raw_ax = Wire.read() << 8 | Wire.read();
  int16_t raw_ay = Wire.read() << 8 | Wire.read();
  int16_t raw_az = Wire.read() << 8 | Wire.read();
  
  // Convert to g-force
  ax = raw_ax / 16384.0;
  ay = raw_ay / 16384.0;
  az = raw_az / 16384.0;
}

void getGPSFix() {
  Serial.println("Powering GPS...");
  VextON();
  delay(10);
  GPS.begin();

  uint32_t start = millis();
  bool gotFix = false;

  while ((millis() - start) < GPS_TIMEOUT) {
    while (GPS.available() > 0) {
      GPS.encode(GPS.read());
    }
    if (GPS.location.isValid() && GPS.location.age() < 2000) {
      latitude = GPS.location.lat();
      longitude = GPS.location.lng();
      gotFix = true;
      break;
    }
  }

  if (!gotFix) {
    latitude = 0.0;
    longitude = 0.0;
  }
  GPS.end();
  VextOFF();
}

void updateSensors() {
  // light sensor
  lux = readLightSensor();
  
  // accelerometer data
  float ax, ay, az;
  readMPU6050(ax, ay, az);
  
  // Calculate movement 
  float acc_magnitude = sqrt(ax * ax + ay * ay + az * az);
  if (acc_magnitude > 1.1) { // Threshold for movement detection (1.1g)
    movementSum += (uint16_t)(acc_magnitude * 100);
  }

  // Status 
  if (movementSum < 100) {
    flags = (flags & ~0b110) | (0b10 << 1);  // problem
  } else if (movementSum < 1000) {
    flags = (flags & ~0b110) | (0b01 << 1);  // chill
  } else {
    flags = (flags & ~0b110) | (0b00 << 1);  // curious
  }

  // Sleep flag
  flags &= ~0b001; // sleeping = 0
  
  readBattery();
  
  Serial.printf("Accel: X=%.2fg, Y=%.2fg, Z=%.2fg, Lux: %.1f\n", ax, ay, az, lux);
}

void sendPacket() {
  int32_t lat_i = (int32_t)(latitude * 1000000);
  int32_t lon_i = (int32_t)(longitude * 1000000);
  uint16_t lux_i = (uint16_t)lux;

  uint8_t payload[14];  
  memcpy(payload, &lat_i, 4);
  memcpy(payload + 4, &lon_i, 4);
  memcpy(payload + 8, &movementSum, 2);
  memcpy(payload + 10, &lux_i, 2);
  payload[12] = flags;
  payload[13] = batteryPercent;  

  Serial.println("Sending binary payload:");
  Serial.printf("Lat: %.6f Lon: %.6f Movement: %d Lux: %.1f Flags: %d Battery: %d%%\n",
                latitude, longitude, movementSum, lux, flags, batteryPercent);

  Radio.Send(payload, sizeof(payload));
}

void OnTxDone(void) { Serial.println("TX done, sleeping..."); lowPowerHandler(); }
void OnTxTimeout(void) { Serial.println("TX timeout, sleeping..."); lowPowerHandler(); }

void setup() {
  Serial.begin(115200);
  while (!Serial);

  // Init battery monitoring
  pinMode(BATTERY_PIN, INPUT);
  
  // Init LoRa
  RadioEvents.TxDone = OnTxDone;
  RadioEvents.TxTimeout = OnTxTimeout;
  Radio.Init(&RadioEvents);
  Radio.SetChannel(RF_FREQUENCY);
  Radio.SetTxConfig(MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
                    LORA_SPREADING_FACTOR, LORA_CODINGRATE,
                    LORA_PREAMBLE_LENGTH, false,
                    true, 0, 0, false, 3000);

  Wire.begin(4, 5); // !!! SDA on pin 4, SCL on pin 5

  Wire.beginTransmission(BH1750_ADDRESS);
  Wire.write(0x01);
  Wire.endTransmission();
  
  Serial.println("Sensors initialized");

  TimerInit(&wakeTimer, [] {});
  TimerSetValue(&wakeTimer, SLEEP_INTERVAL);
}

void loop() {
  getGPSFix();
  updateSensors();
  sendPacket();

  TimerStart(&wakeTimer);
  lowPowerHandler();
}