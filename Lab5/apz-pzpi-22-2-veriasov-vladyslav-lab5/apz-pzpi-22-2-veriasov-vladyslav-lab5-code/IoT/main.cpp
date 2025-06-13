#include <TinyGsmClient.h>
#include <HTTPClient.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

#define LOCATION_RX 16
#define LOCATION_TX 17
#define MODEM_RX 18
#define MODEM_TX 19
#define GPS_BAUD 9600

HardwareSerial gpsSerial(2); //Ports 16, 17
TinyGPSPlus gps;

SoftwareSerial SerialAT(MODEM_RX, MODEM_TX); 
TinyGsm modem(SerialAT);
TinyGsmClient client(modem);
HTTPClient http;

void getLocation(double &lat, double &lon) {
  if(gpsSerial.available()) {
    char gpsData = gpsSerial.read();
    gps.encode(gpsData);
    if (gps.location.isValid()) {
      lat = gps.location.lat();
      lon = gps.location.lng();
    }
  }
}

void sendLocationToServer() {
  if (!modem.gprsConnect("apn", "user", "pass")) {
    Serial.println("GPRS fail");
    return;
  }

  http.begin(client, "http://server.com/api/location");
  http.addHeader("Content-Type", "application/json");

  double latitude 0.0;
  double longitude = 0.0;
  getLocation(latitude, longitude);

  StaticJsonDocument<200> doc;
  doc["latitude"] = coords.first;
  doc["longitude"] = coords.second;

  String json;
  serializeJson(doc, json);
    int httpResponseCode = http.POST(json);

  Serial.println(httpResponseCode);
  http.end();
}

void lockScooter() {
  //Here must be the calling of specific scooter commands.  
}

void unlockScooter() {
  //Here must be the calling of specific scooter commands.  
}

void setup() {
  Serial.begin(115200);
  SerialAT.begin(9600);
  modem.restart();
  modem.sendAT("+CMGF=1"); 
  modem.sendAT("+CNMI=1,2,0,0,0"); 

  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, LOCATION_RX, LOCATION_TX);
}

void loop() {
  if (SerialAT.available()) {
    String sms = SerialAT.readString();
    if (sms.indexOf("GET_LOCATION") != -1) {
      sendLocationToServer();
    } else if (sms.indexOf("LOCK_SCOOTER") != -1) {
      lockScooter();
    } else if (sms.indexOf("UNLOCK_SCOOTER") != -1) {
      unlockScooter();
    }
  }
}