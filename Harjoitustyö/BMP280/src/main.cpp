#include <Arduino.h>
#include "measurements.h"
#include "websrv.h"
#include "config.h"

// Put your real credentials here (or fetch from a header you git-ignore)

void setup() {
    Serial.begin(115200);
    delay(2000);
    
    if (!initBMP280()) {
        Serial.println("❌ Failed to initialize BMP280!");
        while (true) delay(100);
    }
    Serial.println("✅ BMP280 initialized!");

    bool wifi_ok = websrv::begin(WIFI_SSID, WIFI_PASSWORD, /*port*/80, /*timeout*/20000);

    if (!wifi_ok) {
      Serial.println("Proceeding without Wi-Fi; server will bind when network comes up.");
    } else {
      Serial.print("Open: http://");
      Serial.print(websrv::ip());
      Serial.println("/");
    }
}

void loop() {
  websrv::loop();
}
