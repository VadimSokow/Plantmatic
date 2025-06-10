import time
import Config.pin_config as config
import RPi.GPIO as GPIO

from Pflanzomat.interfaces.actuator_interface import LedColor
from Pflanzomat.hardware.sensors.dht11_sensor import DHT11Sensor
from Pflanzomat.hardware.sensors.ads1115_soil_moisture_sensor import ADS1115SoilSensor
from Pflanzomat.hardware.actuators.pump import Pump
from Pflanzomat.hardware.sensors.ads1115_light_sensor import ADS1115LightSensor
from Pflanzomat.hardware.actuators.led_actuator import LedActuator

# Temperatur- und Luftfeuchte Sensor initialisieren
dht_sensor = DHT11Sensor(config.DHT11_PIN)
# Bodenfeuchte Sensor initialisieren
soil_sensor = ADS1115SoilSensor(
    adc_channel=config.SOIL_MOISTURE_ADC_CHANNEL_SLOT0,
    voltage_dry=config.SOIL_MOISTURE_VOLTAGE_DRY,
    voltage_wet=config.SOIL_MOISTURE_VOLTAGE_WET
)
# Licht Sensor initialisieren
light_sensor = ADS1115LightSensor(
    config.LIGHT_SENSOR_ADC_CHANNEL,
    config.LIGHT_SENSOR_VOLTAGE_DARK,
    config.LIGHT_SENSOR_VOLTAGE_BRIGHT
)
# Pumpe initialisieren
GPIO.setmode(GPIO.BCM) #für die Verwendung des Pins im setup der Pump.py
pump = Pump(config.RELAY_PIN_PUMP_SLOT0.id)
pump.setup()
# LEDs initialisieren
leds = LedActuator(config.LED_PIN_RED_SLOT0.id,config.LED_PIN_YELLOW_SLOT0.id,config.LED_PIN_GREEN_SLOT0.id)
leds.setup()

try:
    while True:


        # Temp und Luftfeuchte Auslesen
        temp, hum = dht_sensor.read_combined()
        if temp is not None and hum is not None:
            print(f"DHT11: Temperatur={temp:.1f}°C, Luftfeuchtigkeit={hum:.1f}%")
        else:
            print("DHT11: Konnte nicht gelesen werden.")
        #Bodenfeuchte Auslesen
        moisture = soil_sensor.get_moisture_percent()
        if moisture is not None:
            print(f"Bodenfeuchte: {moisture:.1f}%")
        else:
            print("Bodenfeuchte: Konnte nicht gelesen werden.")

        light = light_sensor.get_light_level_lux()
        print(f"Lichtintensität: {light:.1f}Lux")

        # Sicherheitsabschaltung, wenn Sensorwert fehlt
        if moisture is None:
            if pump.is_on:
                print(
                    "WARNUNG: Bodenfeuchte nicht lesbar, schalte Pumpe sicherheitshalber AUS!")
                pump.pump_off()

        # Pumpe aktivieren, wenn Bodenfeuchte über 60% (TODO Testweise)
        if pump is None:
            print("Fehler beim Initialiseren der Pumpe.")
            break
        if moisture is None:
            print("Fehler beim Initialisieren des Bodenfeuchtesensors.")
            break
        if moisture > 60:
            pump.pump_on()
            print("Pumpe eingeschaltet.")
            leds.set_status_color(LedColor.RED)
        else:
            pump.pump_off()
            print("Pumpe ausgeschaltet.")
            leds.set_status_color(LedColor.GREEN)

        time.sleep(3)

except KeyboardInterrupt:
    print("\nTest gestoppt.")
finally:
    print("\nRäume auf...")
    if 'dht_sensor' in locals():
        dht_sensor.cleanup()
    if 'soil_sensor' in locals():
        soil_sensor.cleanup()
    if 'pump' in locals():
        pump.cleanup()
    GPIO.cleanup()
    print("Aufgeräumt.")
