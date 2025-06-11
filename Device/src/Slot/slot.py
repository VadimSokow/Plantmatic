import json

from hardware.actuators.led_actuator import LedActuator
from hardware.actuators.pump import Pump
from hardware.sensors.ads1115_light_sensor import ADS1115LightSensor
from hardware.sensors.ads1115_soil_moisture_sensor import ADS1115SoilSensor
from hardware.sensors.dht11_sensor import DHT11Sensor
from hardware.interfaces.actuator_interface import LedColor

class Slot:
    def __init__(
            self,
            slot_num: int,
            pump: Pump,
            leds: LedActuator,
            light_sensor: ADS1115LightSensor,
            soil_sensor: ADS1115SoilSensor,
            dht11_sensor: DHT11Sensor,
    ):
        self.slot_num = slot_num
        self.pump = pump
        self.leds = leds
        self.light_sensor = light_sensor
        self.soil_sensor = soil_sensor
        self.dht11_sensor = dht11_sensor

    def get_all_sensor_values(self) -> str | None:
        """
        Builds a JSON String of all sensor values.
        :return: A JSON with all Sensor values.
        """
        humidity_percent = self.dht11_sensor.get_humidity_percent()
        temperature_c = self.dht11_sensor.get_temperature_celsius()
        soil_moisture_percent = self.soil_sensor.get_moisture_percent()
        light_level_lux = self.light_sensor.get_light_level_lux()
        # Dict mit allen Sensorwerten bauen
        sensor_values = {
            self.dht11_sensor.humidity_value_name: humidity_percent,
            self.dht11_sensor.temperature_value_name: temperature_c,
            self.soil_sensor.value_name: soil_moisture_percent,
            self.light_sensor.value_name: light_level_lux,
        }
        return sensor_values

    def pump_for_duration(self, duration: int):
        """
        Activates the pump in that slot for a specific duration
        :param duration: pump duration in seconds
        """
        self.pump.pump_for_duration(duration)

    def led_set_status_color(self, color: LedColor):
        """
        Sets the LED Actuator to a specific color.
        :param color: to set the LED Actuator to. E.g., LedColor.RED
        """
        self.leds.set_status_color(color)
