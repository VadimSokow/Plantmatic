import abc
from typing import Tuple, Optional

class SensorInterface(abc.ABC):
    """Base Interface for all Sensors."""
    @abc.abstractmethod
    def read(self):
        """Reads all sensor values."""
        pass

    @abc.abstractmethod
    def get_value(self) -> Optional[float]:
        """
        Returns the main sensor value.
        :return: Main sensor value.
        """
        pass

class TemperatureSensorInterface(SensorInterface):
    """Interface for Temperature Sensors."""
    @abc.abstractmethod
    def get_temperature_celsius(self) -> Optional[float]:
        """
        Returns the temperature in celsius.
        :return: Temperature in celsius.
        """
        pass

    def get_value(self) -> Optional[float]:
        return self.get_temperature_celsius()

    def read(self):
        return self.get_temperature_celsius()

class HumiditySensorInterface(SensorInterface):
    """Interface for Humidity Sensors."""
    @abc.abstractmethod
    def get_humidity_percent(self) -> Optional[float]:
        """
        Returns the humidity in percent.
        :return: Humidity in percent.
        """
        pass

    def get_value(self) -> Optional[float]:
        return self.get_humidity_percent()

    def read(self):
        return self.get_humidity_percent()

class SoilMoistureSensorInterface(SensorInterface):
    """Interface for Soil Moisture Sensors."""
    @abc.abstractmethod
    def get_moisture_percent(self) -> Optional[float]:
        """
        Returns the moisture in relative percent.
        :return: Moisture in relative percent.
        """
        pass

    def get_value(self) -> Optional[float]:
        return self.get_moisture_percent()

    def read(self):
        return self.get_moisture_percent()

class LightSensorInterface(SensorInterface):
    """Interface for Light Sensors."""
    @abc.abstractmethod
    def get_light_level_lux(self) -> Optional[float]:
        """
        Returns the light level in lux.
        :return: Light level in lux.
        """
        pass

    def get_value(self) -> Optional[float]:
        return self.get_light_level_lux()

    def read(self):
        return self.get_light_level_lux()

class TempHumiditySensorInterface(TemperatureSensorInterface, HumiditySensorInterface):
    """Interface for Temperature and Humidity Sensors."""
    @abc.abstractmethod
    def read_combined(self) -> Tuple[Optional[float], Optional[float]]:
        """
        Returns the combined temperature and humidity.
        :return: Tupel of temperature and humidity.
        """
        pass

    def get_temperature_celsius(self) -> Optional[float]:
        """
        Returns the temperature in celsius.
        :return: Temperature in celsius.
        """
        pass

    def get_humidity_percent(self) -> Optional[float]:
        """
        Returns the humidity in percent.
        :return: Humidity in percent.
        """
        pass

    def get_value(self):
         return self.get_temperature_celsius()

    def read(self):
        return self.read_combined()
