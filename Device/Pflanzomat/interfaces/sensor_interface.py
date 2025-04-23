import abc
from typing import Tuple, Optional # Für Type Hinting

class SensorInterface(abc.ABC):
    """Basis-Interface für alle Sensoren."""
    @abc.abstractmethod
    def read(self):
        """Liest den Sensorwert aus."""
        pass

    @abc.abstractmethod
    def get_value(self) -> Optional[float]:
         """Gibt den primären Sensorwert zurück oder None bei Fehler."""
         pass

class TemperatureSensorInterface(SensorInterface):
    """Interface für Temperatursensoren."""
    @abc.abstractmethod
    def get_temperature_celsius(self) -> Optional[float]:
        """Gibt die Temperatur in Grad Celsius zurück oder None bei Fehler."""
        pass

    def get_value(self) -> Optional[float]:
        return self.get_temperature_celsius()

    def read(self):
        return self.get_temperature_celsius()

class HumiditySensorInterface(SensorInterface):
    """Interface für Feuchtigkeitssensoren."""
    @abc.abstractmethod
    def get_humidity_percent(self) -> Optional[float]:
        """Gibt die relative Luftfeuchtigkeit in Prozent zurück oder None bei Fehler."""
        pass

    def get_value(self) -> Optional[float]:
        return self.get_humidity_percent()

    def read(self):
        return self.get_humidity_percent()

class SoilMoistureSensorInterface(SensorInterface):
    """Interface für Bodenfeuchtesensoren."""
    @abc.abstractmethod
    def get_moisture_percent(self) -> Optional[float]:
        """Gibt die Bodenfeuchte als normalisierten Prozentwert (0-100) zurück oder None bei Fehler."""
        pass

    def get_value(self) -> Optional[float]:
        return self.get_moisture_percent()

    def read(self):
        return self.get_moisture_percent()

class LightSensorInterface(SensorInterface):
    """Interface für Lichtsensoren."""
    @abc.abstractmethod
    def get_light_level_percent(self) -> Optional[float]:
        """Gibt die Lichtintensität als normalisierten Prozentwert (0-100) zurück oder None bei Fehler."""
        pass

    def get_value(self) -> Optional[float]:
        return self.get_light_level_percent()

    def read(self):
        return self.get_light_level_percent()

class TempHumiditySensorInterface(TemperatureSensorInterface, HumiditySensorInterface):
    """Interface für Sensoren, die Temperatur und Feuchtigkeit messen."""
    @abc.abstractmethod
    def read_combined(self) -> Tuple[Optional[float], Optional[float]]:
        """Gibt ein Tupel (Temperatur C, Feuchtigkeit %) zurück."""
        pass

    def get_temperature_celsius(self) -> Optional[float]:
        temp, _ = self.read_combined()
        return temp

    def get_humidity_percent(self) -> Optional[float]:
        _, hum = self.read_combined()
        return hum

    def get_value(self):
         return self.get_temperature_celsius()

    def read(self):
        return self.read_combined()
