import abc
from enum import Enum, auto
from typing import Optional

class ActuatorInterface(abc.ABC):
    """Base Interface for all Actuators."""
    @abc.abstractmethod
    def setup(self):
        """Initializes the Actuator."""
        pass

    @abc.abstractmethod
    def cleanup(self):
        """Cleans up the Actuator Resources."""
        pass

class LedColor(Enum):
    """Defines the colors an LED Actuator can use."""
    OFF = auto()
    RED = auto()
    YELLOW = auto()
    GREEN = auto()

class LedActuatorInterface(ActuatorInterface):
    """Interface for the status LEDs."""
    @abc.abstractmethod
    def set_status_color(self, color: LedColor):
        """Sets the color of the status LED."""
        pass

class PumpActuatorInterface(ActuatorInterface):
    """Interface for the water pump"""
    @abc.abstractmethod
    def pump_on(self):
        """Turns the pump on."""
        pass

    @abc.abstractmethod
    def pump_off(self):
        """Turns the pump off."""
        pass

    def pump_for_duration(self, duration_seconds: float):
        """
        Activates the pump for a specific duration
        :param duration: pump duration in seconds
        """
        import time
        if duration_seconds > 0:
            print(f"Pumpe für {duration_seconds:.1f} Sekunden einschalten...")
            self.pump_on()
            time.sleep(duration_seconds)
            self.pump_off()
            print("Pumpe ausgeschaltet.")