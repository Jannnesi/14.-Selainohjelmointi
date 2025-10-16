#pragma once
#include <Arduino.h>
#include <IPAddress.h>

// Forward declare to avoid leaking heavy headers here
class WebServer;

namespace websrv {

// Start Wi-Fi (STA), create WebServer, register default routes, begin() it.
// Returns true on Wi-Fi connected (server starts regardless).
bool begin(const char* ssid, const char* password,
           uint16_t port = 80, uint32_t wifi_timeout_ms = 20000);

// Call from loop()
void loop();

// Current STA IP (0.0.0.0 if not connected)
IPAddress ip();

// Access the underlying WebServer to add custom routes in your main code.
WebServer& server();

} // namespace websrv
