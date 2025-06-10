import RPi.GPIO as GPIO
import time
from ...interfaces.actuator_interface import PumpActuatorInterface

# Relais schaltet bei LOW Signal!
RELAY_ON_STATE = GPIO.LOW   # Relais AN bei GPIO.LOW
RELAY_OFF_STATE = GPIO.HIGH # Relais AUS bei GPIO.HIGH

class Pump(PumpActuatorInterface):

    def __init__(self, pin: int):
        """
        :param pin: The BCM GPIO Pin that is connected to the Pump
        """
        self.pin = pin
        self.is_on = False

    def setup(self):
        """Sets up the Pump as an output."""
        try:
            GPIO.setup(self.pin, GPIO.OUT, initial=RELAY_OFF_STATE) #  Pin als Output festlegen, Initial LOW/0
            self.is_on = (RELAY_OFF_STATE == RELAY_ON_STATE) # Setze initialen Zustand Aus/False
        except Exception as e:
            print(f"FEHLER beim Setup für Pumpen-Pin {self.pin}: {e}")

    def pump_on(self):
        """Turns the pump on."""
        if not self.is_on:
            try:
                GPIO.output(self.pin, RELAY_ON_STATE)
                self.is_on = True
            except Exception as e:
                 print(f"FEHLER beim Einschalten der Pumpe (Pin {self.pin}): {e}")

    def pump_off(self):
        """Turns the pump off."""
        if self.is_on:
            try:
                GPIO.output(self.pin, RELAY_OFF_STATE)
                self.is_on = False
            except Exception as e:
                 print(f"FEHLER beim Ausschalten der Pumpe (Pin {self.pin}): {e}")

    def cleanup(self):
        """Cleanup. Turns off the Pump."""
        self.pump_off()