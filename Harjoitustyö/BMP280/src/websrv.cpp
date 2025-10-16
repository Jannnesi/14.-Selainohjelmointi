#include "websrv.h"
#include "measurements.h"

#include <WiFi.h>
#include <WebServer.h>

namespace {
  WebServer* g_server = nullptr;

  void handleRoot() {
    g_server->send(200, "text/plain", "OK");
  }

  void handleStatus() {
    String json = "{\"uptime_ms\":" + String(millis()) + "}";
    g_server->sendHeader("Access-Control-Allow-Origin", "*");
    g_server->send(200, "application/json", json);
  }

  void handleBmp() {
    Measurements m = takeMeasurement();
    String json = "{";
    json += "\"temp\":" + String(m.temperature, 2) + ",";
    json += "\"pressure\":" + String(m.pressure, 2) + ",";
    json += "\"altitude\":" + String(m.altitude, 2);
    json += "}";
    g_server->sendHeader("Access-Control-Allow-Origin", "*");
    g_server->send(200, "application/json", json);
  }

  void handleNotFound() {
    String msg = "Not found: " + g_server->uri() + "\n";
    g_server->send(404, "text/plain", msg);
  }

  bool connectWiFi(const char* ssid, const char* password, uint32_t timeout_ms) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    Serial.print("Connecting to WiFi");
    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED) {
      delay(300);
      Serial.print(".");
      if (millis() - start > timeout_ms) break;
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("WiFi connected!");
      Serial.print("IP: ");
      Serial.println(WiFi.localIP());
      return true;
    } else {
      Serial.println("WiFi connect timeout. Server will still start; check creds/AP.");
      return false;
    }
  }
} // namespace

namespace websrv {

bool begin(const char* ssid, const char* password,
           uint16_t port, uint32_t wifi_timeout_ms) {
  static WebServer server_inst(port);  // static lifetime in this TU
  g_server = &server_inst;

  bool wifi_ok = connectWiFi(ssid, password, wifi_timeout_ms);

  // Default routes
  g_server->on("/", HTTP_GET, handleRoot);
  g_server->on("/status", HTTP_GET, handleStatus);
  g_server->on("/bmp", HTTP_GET, handleBmp);
  g_server->onNotFound(handleNotFound);

  g_server->begin();
  Serial.printf("HTTP server started on port %u\n", port);
  return wifi_ok;
}

void loop() {
  if (g_server) g_server->handleClient();
}

IPAddress ip() {
  return WiFi.localIP();
}

WebServer& server() {
  // Safe because we construct static server_inst in begin()
  return *g_server;
}

} // namespace websrv
