#include "measurements.h"

Adafruit_BMP280 bmp;

bool initBMP280(uint8_t address, uint8_t sda, uint8_t scl) {
    Wire.begin(sda, scl);
    unsigned status;
    status = bmp.begin(address);
    if (!status) {
        Serial.println("Could not find a valid BMP280 sensor, check wiring!");
        while (1) delay(10);
    }
    bmp.setSampling(Adafruit_BMP280::MODE_FORCED,     /* Operating Mode. */
                    Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                    Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                    Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                    Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */


    return status;
}

Measurements takeMeasurement() {
    Measurements m;
    // Trigger a new conversion in forced mode before reading
    bmp.takeForcedMeasurement();
    m.temperature = bmp.readTemperature();
    m.pressure    = bmp.readPressure() / 100.0F;
    m.altitude    = bmp.readAltitude(1013.25);

    Serial.print("T: ");
    Serial.print(m.temperature, 2);
    Serial.print(" °C  |  P: ");
    Serial.print(m.pressure, 2);
    Serial.print(" hPa  |  Alt: ");
    Serial.print(m.altitude, 2);
    Serial.println(" m");
    return m;
}
