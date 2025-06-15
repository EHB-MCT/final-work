// This code is for the T-Beam ESP32 LoRa GPS module to send GPS coordinates over LoRa.
// -> Doesn't work anymore, we use tbeam-sender.ino instead, to send data directly over wi-fi to the server.


#include <XPowersLib.h>
#include <TinyGPSPlus.h>
#include <LoRa.h>
#include <SPI.h>
#include <Wire.h>


XPowersAXP2101 PMU;
#define PMU_I2C_ADDRESS 0x34
#define GPS_RX 34
#define GPS_TX 12
HardwareSerial gpsSerial(1); // UART1
TinyGPSPlus gps;


#define LORA_SCK 5
#define LORA_MISO 19
#define LORA_MOSI 27
#define LORA_SS 18
#define LORA_RST 23
#define LORA_DIO0 26
#define LORA_BAND 868E6 

void setup() {
  Serial.begin(115200);
  delay(1000);


  Wire.begin();
  if (!PMU.begin(Wire, PMU_I2C_ADDRESS, SDA, SCL)) {
    Serial.println("PMU failed!");
    while (1);
  }
  PMU.enableDC1();
  PMU.enableDC3();
  PMU.enableALDO3(); // GPS power
  PMU.setALDO3Voltage(3300);
  PMU.enableALDO2(); // GPS antenna power


  gpsSerial.begin(115200, SERIAL_8N1, GPS_RX, GPS_TX);


  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  
  if (!LoRa.begin(LORA_BAND)) {
    Serial.println("LoRa failed!");
    while (1);
  }
  
  
  LoRa.setSyncWord(0x34);       
  LoRa.setSpreadingFactor(7);  
  LoRa.setSignalBandwidth(125E3); 
  LoRa.setCodingRate4(5);       
  LoRa.setTxPower(14);          

  Serial.println("System ready");
}

void loop() {
  // Process GPS data
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }

  // When valid GPS available
  if (gps.location.isUpdated() && gps.location.isValid()) {
    String payload = 
      String(gps.location.lat(), 6) + "," + 
      String(gps.location.lng(), 6);

    Serial.print("Sending: ");
    Serial.println(payload);

    // Send LoRa packet
    LoRa.beginPacket();
    LoRa.print(payload);
    LoRa.endPacket();
  }

  delay(2000); // Send every 2 seconds
}