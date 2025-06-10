import time
from typing import Optional
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
from ...interfaces.sensor_interface import SoilMoistureSensorInterface

class ADS1115SoilSensor(SoilMoistureSensorInterface):

    def __init__(self, adc_channel, voltage_dry: float, voltage_wet: float, i2c_address=0x48):
        """
        Initializes the sensor.
        :param adc_channel: ADC pin
        :param voltage_dry: Calibration value for dry state (Volts).
        :param voltage_wet: Calibration value for wet state (Volts).
        :param i2c_address: The I2C address of the ADS1115 (default 0x48).
        """
        self.adc_channel = adc_channel
        self.voltage_dry = voltage_dry
        self.voltage_wet = voltage_wet
        self.i2c_address = i2c_address
        self.ads = None     #Analog Digital Wandler
        self.chan = None    #Sensor am ADC Pin
        self.value_name = "soil_moisture_percent"
        self._setup()

    def _setup(self):
        """Initializes the I2C connection and the ADC."""
        try:
            i2c = busio.I2C(board.SCL, board.SDA)
            self.ads = ADS.ADS1115(i2c, address=self.i2c_address)
            self.ads.gain = 1
            self.chan = AnalogIn(self.ads, self.adc_channel)
            #print(f"ADS1115 an Adresse {hex(self.i2c_address)} initialisiert für Kanal {self.adc_channel}.")
        except ValueError:
            print(f"Fehler: ADS1115 an Adresse {hex(self.i2c_address)} nicht gefunden. Verbindung prüfen & I2C aktiviert?")
            self.ads = None
            self.chan = None
        except Exception as e:
            print(f"Unerwarteter Fehler bei ADS1115 Initialisierung: {e}")
            self.ads = None
            self.chan = None

    def get_moisture_percent(self) -> Optional[float]:
        """Reads the voltage and converts it to percent.
        :return percent: Soil moisture as a percentage value (0-100).
        :return None: If an error occurred with the sensor or sensor communication
        """
        if not self.chan or not self.ads:
            print("Fehler: ADS1115 Kanal nicht initialisiert.")
            return None

        try:
            # Spannung auslesen
            current_voltage = self.chan.voltage
            #print(f"DEBUG: Gemessene Spannung: {current_voltage:.3f} V") # Zum Debuggen/Kalibrieren

            range_voltage = self.voltage_dry - self.voltage_wet
            if range_voltage <= 0:
                print("Fehler: Kalibrierungswerte voltage_dry/voltage_wet ungültig.")
                return None

            percent = 100.0 * (self.voltage_dry - current_voltage) / range_voltage

            percent = max(0.0, min(100.0, percent))

            return percent

        except OSError as e:
            print(f"Fehler beim Lesen von I2C/ADS1115: {e}")
            return None
        except Exception as e:
            print(f"Unerwarteter Fehler beim Lesen der Bodenfeuchte: {e}")
            return None

    def cleanup(self):
        print("ADS1115 Soil Sensor Cleanup")