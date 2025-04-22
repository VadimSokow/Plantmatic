import adafruit_dht
import time
from typing import Optional, Tuple
from ...interfaces.sensor_interface import TempHumiditySensorInterface


class DHT11Sensor(TempHumiditySensorInterface):
    def __init__(self, pin):
        self.pin = pin
        self.dht_device = None
        self.last_read_time = 0
        self.min_interval = 2.0
        self.last_temp = None
        self.last_hum = None
        self._setup()

    def _setup(self):
        """Interne Setup-Methode."""
        try:
            self.dht_device = adafruit_dht.DHT11(self.pin, use_pulseio=False)
            print(f"DHT11 Sensor an GPIO {self.pin.id} initialisiert.")
        except RuntimeError as error:
            print(f"Fehler bei der Initialisierung des DHT11: {error.args[0]}")
            self.dht_device = None
        except Exception as e:
            print(f"Unerwarteter Fehler bei DHT11 Initialisierung: {e}")
            self.dht_device = None

    def read_combined(self) -> Tuple[Optional[float], Optional[float]]:
        """Liest Temperatur und Feuchtigkeit"""
        current_time = time.monotonic()
        if self.dht_device is None:
            print("DHT11 nicht initialisiert.")
            return None, None

        # Prüfe, ob genug Zeit seit dem letzten Lesen vergangen ist
        if (current_time - self.last_read_time) < self.min_interval:
            # Gebe die zuletzt erfolgreich gelesenen Werte zurück, wenn zu früh
            return self.last_temp, self.last_hum

        try:
            temperature_c = self.dht_device.temperature
            humidity = self.dht_device.humidity
            self.last_read_time = current_time

            # prüfen, ob Sensorwerte gültig sind
            if temperature_c is not None and humidity is not None:
                self.last_temp = temperature_c
                self.last_hum = humidity
                return temperature_c, humidity
            else:
                # Wenn Sensorwerte ungültig, letzte gemessene Werte zurückgeben
                print("DHT11 lieferte None, gebe letzte bekannte Werte zurück.")
                return self.last_temp, self.last_hum

        except RuntimeError as error:
            # bei Lesefehlern alte Werte zurückgeben
            return self.last_temp, self.last_hum
        except Exception as e:
            print(f"Unerwarteter Fehler beim Lesen des DHT11: {e}")
            return None, None

    def cleanup(self):
        """Gibt die Ressourcen des DHT-Sensors frei."""
        if self.dht_device:
            try:
                self.dht_device.exit()
                print("DHT11 Ressourcen freigegeben.")
            except Exception as e:
                 print(f"Fehler beim Freigeben der DHT11 Ressourcen: {e}")