import \
    json

from Device.src.hardware.actuators.led_actuator import \
    LedActuator
from Device.src.hardware.actuators.pump import \
    Pump
from Device.src.hardware.sensors.ads1115_light_sensor import \
    ADS1115LightSensor
from Device.src.hardware.sensors.ads1115_soil_moisture_sensor import \
    ADS1115SoilSensor
from Device.src.hardware.sensors.dht11_sensor import \
    DHT11Sensor
from Device.src.interfaces.actuator_interface import \
    LedColor

class Slot:
    def __init__(
            self,
            slot_num: int,
            pump: Pump,
            leds: LedActuator,
            light_sensor: ADS1115LightSensor,
            soil_sensor: ADS1115SoilSensor,
            dht11_sensor: DHT11Sensor
    ):
        self.slot_id = slot_num
        self.pump = pump
        self.leds = leds
        self.light_sensor = light_sensor
        self.soil_sensor = soil_sensor
        self.dht11_sensor = dht11_sensor

    def get_all_sensor_values(self) -> str:
        # Alle Werte aus den Sensoren holen
        humidity_percent = self.dht11_sensor.get_humidity_percent()
        temperature_c = self.dht11_sensor.get_temperature_celsius()
        soil_moisture_percent = self.soil_sensor.get_moisture_percent()
        light_level_lux = self.light_sensor.get_light_level_percent()
        # Dict mit allen Sensorwerten bauen
        sensor_values = {
            self.dht11_sensor.humidity_value_name: humidity_percent,
            self.dht11_sensor.temperature_value_name: temperature_c,
            self.soil_sensor.value_name: soil_moisture_percent,
            self.light_sensor.value_name: light_level_lux,
        }
        return json.dumps(sensor_values)

    def pump_for_duration(self, duration: int):
        self.pump.pump_for_duration(duration)

    def led_set_status_color(self, color: LedColor):
        self.leds.set_status_color(color)


