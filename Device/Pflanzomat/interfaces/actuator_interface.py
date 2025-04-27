import abc
from enum import Enum, auto
from typing import Optional # Für Type Hinting

class ActuatorInterface(abc.ABC):
    """Basis-Interface für alle Aktoren."""
    @abc.abstractmethod
    def setup(self):
        """Führt Initialisierungen für den Aktor durch."""
        pass

    @abc.abstractmethod
    def cleanup(self):
        """Räumt Ressourcen auf, wenn der Aktor nicht mehr benötigt wird."""
        pass

class LedColor(Enum):
    """Definiert mögliche Farben für die Status-LED."""
    OFF = auto()
    RED = auto()
    YELLOW = auto()
    GREEN = auto()

class LedActuatorInterface(ActuatorInterface):
    """Interface für die Status-LED."""
    @abc.abstractmethod
    def set_status_color(self, color: LedColor):
        """Setzt die Farbe der Status-LED."""
        pass

class PumpActuatorInterface(ActuatorInterface):
    """Interface für die Wasserpumpe."""
    @abc.abstractmethod
    def pump_on(self):
        """Schaltet die Pumpe ein."""
        pass

    @abc.abstractmethod
    def pump_off(self):
        """Schaltet die Pumpe aus."""
        pass

    def pump_for_duration(self, duration_seconds: float):
        """Schaltet die Pumpe für eine bestimmte Dauer ein und dann wieder aus."""
        import time
        if duration_seconds > 0:
            print(f"Pumpe für {duration_seconds:.1f} Sekunden einschalten...")
            self.pump_on()
            time.sleep(duration_seconds)
            self.pump_off()
            print("Pumpe ausgeschaltet.")
    #todo Methode um den aktuellen Status der Pumpe abzufragen