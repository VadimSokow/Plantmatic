from typing import \
    Any


import RPi.GPIO as GPIO
import config

from hardware.actuators.led_actuator import LedActuator
from hardware.actuators.pump import Pump
from hardware.sensors.ads1115_light_sensor import ADS1115LightSensor
from hardware.sensors.ads1115_soil_moisture_sensor import ADS1115SoilSensor
from hardware.sensors.dht11_sensor import DHT11Sensor

from Slot.slot import Slot


class DeviceSlot:
    def __init__(self):
        """
        DeviceSlot holds all the supported slots of a device.
        Device version 1 only supports one plant slot.
        Add more slots in "configure()" method to support more plants.
        """
        self.slots = []
        self.configure()

    def configure(self):
        """
        configures the Slots with the corresponding sensors and actuators.
        Fills the slots array.
        :return:
        """
        # ----- SLOT 0 -----
        # Temperatur- und Luftfeuchte Sensor initialisieren
        dht_sensor = DHT11Sensor(config.DHT11_PIN)
        # Bodenfeuchte Sensor initialisieren
        soil_sensor_0 = ADS1115SoilSensor(adc_channel=config.SOIL_MOISTURE_ADC_CHANNEL_SLOT0,voltage_dry=config.SOIL_MOISTURE_VOLTAGE_DRY,voltage_wet=config.SOIL_MOISTURE_VOLTAGE_WET)
        # Licht Sensor initialisieren
        light_sensor = ADS1115LightSensor(config.LIGHT_SENSOR_ADC_CHANNEL,config.LIGHT_SENSOR_VOLTAGE_DARK,config.LIGHT_SENSOR_VOLTAGE_BRIGHT )
        # Pumpe initialisieren
        GPIO.setmode(GPIO.BCM)  # für die Verwendung des Pins im setup der Pump.py
        pump_0 = Pump(config.RELAY_PIN_PUMP_SLOT0.id)
        # LEDs initialisieren
        leds_0 = LedActuator(config.LED_PIN_RED_SLOT0.id,config.LED_PIN_YELLOW_SLOT0.id,config.LED_PIN_GREEN_SLOT0.id)
        slot_0 = Slot(0,pump_0,leds_0,light_sensor,soil_sensor_0,dht_sensor)

        self.slots.append(slot_0)

    def get_slot(self, slot_num: int) -> Slot | None:
        for slot in self.slots:
            if slot.slot_num == slot_num:
                return slot
        return None

    def cleanup(self):
        if self.slots:
            for slot in self.slots:
                slot.cleanup()