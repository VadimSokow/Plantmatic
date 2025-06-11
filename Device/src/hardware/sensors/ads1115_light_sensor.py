from typing import Optional
import board # Hinzugefügt
import busio # Hinzugefügt
import adafruit_ads1x15.ads1115 as ADS # Hinzugefügt
from adafruit_ads1x15.analog_in import AnalogIn
from ...interfaces.sensor_interface import LightSensorInterface

class ADS1115LightSensor(LightSensorInterface):
    def __init__(self, adc_channel, voltage_dark: float, voltage_bright: float, i2c_address=0x48):
        """
        Initialize the ADS1115 Light Sensor.
        :param adc_channel: the adc chanel to use.
        :param voltage_dark: Calibrations value for dark (Volt).
        :param voltage_bright: Calibrations value for bright (Volt).
        :param i2c_address: The I2C Address of the ADS1115 (Default 0x48).
        """
        self.adc_channel = adc_channel
        self.voltage_dark = voltage_dark
        self.voltage_bright = voltage_bright
        self.i2c_address = i2c_address
        self.ads = None     # Analog Digital Wandler Instanz
        self.chan = None    # Sensor am ADC Pin (AnalogIn Instanz)
        self.value_name = "light_level_lux"

        if self.voltage_dark == self.voltage_bright:
            print("FEHLER: voltage_dark und voltage_bright dürfen nicht identisch sein! Lichtsensor nicht initialisiert.")
            return
        self.voltage_range = self.voltage_dark - self.voltage_bright
        if self.voltage_range <= 0:
            raise ValueError("Spannung bei 0 Lux muss größer sein als bei 800 Lux für dieses Modell!")

        self._setup()

    def _setup(self):
        """Initialises the I2C Connection and the ADC for the Sensor."""
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

    def get_light_level_lux(self) -> Optional[float]:
        """
        Returns the current light level of the sensor.
        :return: Current light level of the sensor in lux.
        """
        if not self.chan or not self.ads: # Prüft ob _setup erfolgreich war
            return None

        try:
            current_voltage = self.chan.voltage
            #print(f"DEBUG Lichtsensor: Spannung={current_voltage:.3f}V")

            brightness_fraction = (self.voltage_dark - current_voltage) / self.voltage_range
            lux_value = 800.0 * brightness_fraction
            lux_value = max( 0.0,lux_value)
            # todo gibt immer ca. 700 Lux raus. Problem mit Verkabelung? soil funktioniert
            return lux_value

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