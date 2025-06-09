import RPi.GPIO as GPIO

from ...interfaces.actuator_interface import \
    LedActuatorInterface, \
    LedColor

class LedActuator(LedActuatorInterface):
    def __init__(self, red_pin: int, yellow_pin: int, green_pin: int):
        self.red_pin = red_pin
        self.yellow_pin = yellow_pin
        self.green_pin = green_pin

        # Dictionary, um Pins den Farben zuzuordnen
        self.led_pins = {
            LedColor.RED: self.red_pin,
            LedColor.YELLOW: self.yellow_pin,
            LedColor.GREEN: self.green_pin
        }
        self.current_color = LedColor.OFF  # Software-seitiger Status
        print(f"LedActuator initialisiert für Pins R:{red_pin}, Y:{yellow_pin}, G:{green_pin}")

    def setup(self):
        try:
            for pin in self.led_pins.values():
                GPIO.setup(
                    pin,
                    GPIO.OUT,
                    initial=GPIO.LOW)  # Alle LEDs initial AUS
            self.current_color = LedColor.OFF
        except Exception as e:
            print(f"FEHLER beim Setup der LED-Pins: {e}")
            raise

    def _set_all_leds_off(self):
        try:
            GPIO.output(
                self.red_pin,
                GPIO.LOW)
            GPIO.output(
                self.yellow_pin,
                GPIO.LOW)
            GPIO.output(
                self.green_pin,
                GPIO.LOW)
        except Exception as e:
            print(f"FEHLER beim Ausschalten aller LEDs: {e}")

    def set_status_color(self,color: LedColor):
        """Setzt die Farbe der Status-LEDs."""
        if color == self.current_color and color != LedColor.OFF:
            return  # Keine Änderung nötig, wenn Farbe schon gesetzt ist (außer bei OFF)

        self._set_all_leds_off()  # erst alle LEDs ausschalten

        if color == LedColor.RED:
            GPIO.output(
                self.red_pin,
                GPIO.HIGH)
        elif color == LedColor.YELLOW:
            GPIO.output(
                self.yellow_pin,
                GPIO.HIGH)
        elif color == LedColor.GREEN:
            GPIO.output(
                self.green_pin,
                GPIO.HIGH)

        self.current_color = color  # Software-Status aktualisieren

    def cleanup(self):
        """Schaltet alle LEDs aus beim Aufräumen."""
        print("Cleanup für LedActuator: Schalte alle LEDs aus.")
        self.set_status_color(LedColor.OFF)