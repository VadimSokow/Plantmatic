from typing import Optional
import board # Hinzugefügt
import busio # Hinzugefügt
import adafruit_ads1x15.ads1115 as ADS # Hinzugefügt
from adafruit_ads1x15.analog_in import AnalogIn
from ...interfaces.sensor_interface import LightSensorInterface

class ADS1115LightSensor(LightSensorInterface):
    def __init__(self, adc_channel, voltage_dark: float, voltage_bright: float, i2c_address=0x48):
        """
        Initialisiert den Lichtsensor.
        :param adc_channel: Der zu verwendende ADC-Pin
        :param voltage_dark: Kalibrierungswert für Dunkelheit (Volt).
        :param voltage_bright: Kalibrierungswert für Helligkeit (Volt).
        :param i2c_address: Die I2C-Adresse des ADS1115 (Standard 0x48).
        """
        self.adc_channel = adc_channel
        self.voltage_dark = voltage_dark
        self.voltage_bright = voltage_bright
        self.i2c_address = i2c_address
        self.ads = None     # Analog Digital Wandler Instanz
        self.chan = None    # Sensor am ADC Pin (AnalogIn Instanz)

        if self.voltage_dark == self.voltage_bright:
            print("FEHLER: voltage_dark und voltage_bright dürfen nicht identisch sein! Lichtsensor nicht initialisiert.")
            return

        self._setup()

    def _setup(self):
        """Initialisiert die I2C-Verbindung und den ADC für diesen Sensor."""
        try:
            i2c = busio.I2C(board.SCL, board.SDA)
            self.ads = ADS.ADS1115(i2c, address=self.i2c_address)
            self.ads.gain = 1
            self.chan = AnalogIn(self.ads, self.adc_channel)
            print(f"ADS1115 Lichtsensor an Adresse {hex(self.i2c_address)} für Kanal {self.adc_channel} initialisiert.")
        except ValueError:
            print(f"FEHLER (Lichtsensor): ADS1115 an Adresse {hex(self.i2c_address)} nicht gefunden. Verbindung prüfen & I2C aktiviert?")
            self.ads = None
            self.chan = None
        except Exception as e:
            print(f"Unerwarteter FEHLER bei ADS1115 Initialisierung (Lichtsensor): {e}")
            self.ads = None
            self.chan = None

    def get_light_level_percent(self) -> Optional[float]:
        """Liest die Spannung und rechnet sie in einen Lichtprozentsatz um."""
        if not self.chan or not self.ads: # Prüft ob _setup erfolgreich war
            return None

        try:
            current_voltage = self.chan.voltage
            # print(f"DEBUG Lichtsensor: Spannung={current_voltage:.3f}V")

            value_range = self.voltage_dark - self.voltage_bright
            if value_range == 0:
                print("FEHLER (Lichtsensor): Kalibrierungsbereich (dark-bright) ist Null.")
                return None

            percent = 100.0 * (self.voltage_dark - current_voltage) / value_range

            percent = max(0.0, min(100.0, percent))
            return percent

        except OSError as e:
            print(f"Fehler beim Lesen von I2C/ADS1115 (Lichtsensor): {e}")
            return None
        except Exception as e:
            print(f"Unerwarteter Fehler beim Lesen des Lichtsensors: {e}")
            return None

    def setup(self):
        if not self.ads or not self.chan:
             print("ADS1115 Lichtsensor: Erneuter Setup-Versuch, falls Initialisierung fehlschlug.")
             self._setup()
        else:
            print("ADS1115 Lichtsensor bereits initialisiert.")


    def cleanup(self):
        print("ADS1115 Lichtsensor Cleanup.")