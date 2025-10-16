#ifndef MEASUREMENTS_H
#define MEASUREMENTS_H

#include <Arduino.h>
#include <Adafruit_BMP280.h>

struct Measurements {
    float temperature;
    float pressure;
    float altitude;
};

// Initializes BMP280 and returns true if successful
bool initBMP280(uint8_t address = 0x76, uint8_t sda = 8, uint8_t scl = 9);

// Takes and returns one measurement set
Measurements takeMeasurement();

#endif
