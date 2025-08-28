#include "LoRaWan_APP.h"
#include "GPS_Air530Z.h"
#include <Wire.h>
#include <BH1750.h>
#include <MPU6050_light.h>

#define BUZZER_PIN GPIO2
#define SLEEP_INTERVAL 60000 // send LoRa packets every 60 seconds, than go to sleep
#define BUZZER_RX_WINDOW 30000

RadioEvents_t RadioEvents;
Air530ZClass GPS;
TimerEvent_t wakeTimer;

BH1750 lightMeter;
MPU6050 mpu(Wire);

double latitude = 0.0;
double longitude = 0.0;
float lux = 0.0;
uint16_t movementSum = 0;
uint8_t flags = 0;
uint8_t battery = 100;
uint16_t sleepTime = 0;
uint16_t jumps = 0;
unsigned long immobileStart = 0;

const float SLEEP_THRESHOLD = 0.05;
const unsigned long MIN_SLEEP_PERIOD = 5 * 60 * 1000;
const float JUMP_THRESHOLD = 2.0;

bool buzzerWindowActive = false;
unsigned long buzzerWindowStart = 0;

void VextON()  { pinMode(Vext, OUTPUT); digitalWrite(Vext, LOW); }
void VextOFF() { pinMode(Vext, OUTPUT); digitalWrite(Vext, HIGH); }

void onWake() {}

void onRxDone(uint8_t *payload, uint16_t size, int16_t rssi, int8_t snr) {
    if (buzzerWindowActive && millis() - buzzerWindowStart < BUZZER_RX_WINDOW) {
        if (size > 0 && payload[0] == 0x01) {
            Serial.println("Buzzer triggered via LoRa!");
            digitalWrite(BUZZER_PIN, HIGH);
            delay(2000);
            digitalWrite(BUZZER_PIN, LOW);
        }
    }
}

void OnTxDone() {
    Serial.println("TX done, opening buzzer RX window...");
    buzzerWindowActive = true;
    buzzerWindowStart = millis();
    Radio.Rx(0); // Open continuous RX for buzzer window
}

void getGPSFix() {
    VextON();
    delay(10);
    GPS.begin();
    uint32_t start = millis();
    bool gotFix = false;
    while ((millis() - start) < 20000) {
        while (GPS.available() > 0) GPS.encode(GPS.read());
        if (GPS.location.isValid() && GPS.location.age() < 2000) {
            latitude = GPS.location.lat();
            longitude = GPS.location.lng();
            gotFix = true;
            break;
        }
    }
    if (!gotFix) { latitude = 0.0; longitude = 0.0; }
    GPS.end();
    VextOFF();
}

void updateSensors() {
    VextON();
    delay(10);
    lux = lightMeter.readLightLevel();
    mpu.update();
    float totalAcc = sqrt(mpu.getAccX()*mpu.getAccX() + mpu.getAccY()*mpu.getAccY() + mpu.getAccZ()*mpu.getAccZ());
    if (totalAcc > 0.1) movementSum += (uint16_t)(totalAcc*10);

    // Sleep detection
    unsigned long now = millis();
    if (totalAcc < SLEEP_THRESHOLD) {
        if (immobileStart == 0) immobileStart = now;
        else if (now - immobileStart >= MIN_SLEEP_PERIOD) sleepTime += (SLEEP_INTERVAL/1000);
    } else immobileStart = 0;

    // Jump detection
    if (totalAcc > JUMP_THRESHOLD) jumps++;

    flags = (flags & ~0b110) | ((movementSum<100)?(0b10<<1):((movementSum<1000)?(0b01<<1):0b00));
    flags &= ~0b001;
    battery = map(getBatteryVoltage(), 3000, 4200, 0, 100);
    VextOFF();
}

void sendPacket() {
    int32_t lat_i = (int32_t)(latitude*1000000);
    int32_t lon_i = (int32_t)(longitude*1000000);
    uint16_t lux_i = (uint16_t)lux;
    uint8_t payload[18];
    memcpy(payload, &lat_i, 4);
    memcpy(payload+4, &lon_i, 4);
    memcpy(payload+8, &movementSum, 2);
    memcpy(payload+10, &lux_i, 2);
    payload[12] = flags;
    payload[13] = battery;
    memcpy(payload+14, &sleepTime, 2);
    memcpy(payload+16, &jumps, 2);

    Serial.println("Sending binary payload...");
    Radio.Send(payload, sizeof(payload));

    movementSum = 0; sleepTime = 0; jumps = 0;
}

void setup() {
    Serial.begin(115200);
    while(!Serial);

    pinMode(BUZZER_PIN, OUTPUT); digitalWrite(BUZZER_PIN, LOW);

    Serial.println("CubeCell LoRa Sender");

    VextON(); delay(50);

    RadioEvents.TxDone = OnTxDone;
    RadioEvents.RxDone = onRxDone;
    Radio.Init(&RadioEvents);
    Radio.SetChannel(868000000);
    Radio.SetTxConfig(MODEM_LORA, 14, 0, 0, 7, 1, 8, false, true, 0, 0, false, 3000);

    Wire.begin(4,5);
    lightMeter.begin();

    byte status = mpu.begin();
    if(status!=0){Serial.println("MPU6050 init failed!"); while(1);}
    delay(1000); mpu.calcOffsets();
    VextOFF();

    TimerInit(&wakeTimer, onWake);
    TimerSetValue(&wakeTimer, SLEEP_INTERVAL);
    TimerStart(&wakeTimer);
}

void loop() {
    getGPSFix();
    updateSensors();
    sendPacket();

    Serial.printf("Sleeping for %lu ms...\n", SLEEP_INTERVAL);
    buzzerWindowActive = true;
    buzzerWindowStart = millis();

    TimerStart(&wakeTimer);
    while (millis() - buzzerWindowStart < BUZZER_RX_WINDOW) {
        lowPowerHandler(); // Stay in low-power while listening for buzzer commands (TODO: might need to improve this, can mess with the gps/lora on long term)
    }

    buzzerWindowActive = false;

    VextOFF();
    lowPowerHandler(); 
}
