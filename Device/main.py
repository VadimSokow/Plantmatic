import time
import config
import RPi.GPIO as GPIO
from Pflanzomat.hardware.sensors.dht11_sensor import DHT11Sensor
from Pflanzomat.hardware.sensors.ads1115_soil_moisture_sensor import ADS1115SoilSensor
from Pflanzomat.hardware.actuators.pump import Pump

# Temperatur- und Luftfeuchte Sensor initialisieren
dht_sensor = DHT11Sensor(config.DHT11_PIN)
# Bodenfeuchte Sensor initialisieren
soil_sensor = ADS1115SoilSensor(
    adc_channel=config.SOIL_MOISTURE_ADC_CHANNEL,
    voltage_dry=config.SOIL_MOISTURE_VOLTAGE_DRY,
    voltage_wet=config.SOIL_MOISTURE_VOLTAGE_WET
)
# Pumpe initialisieren
GPIO.setmode(GPIO.BCM) #für die Verwendung des Pins im setup der Pump.py
pump = Pump(config.RELAY_PIN_PUMP.id)
pump.setup()

try:
    while True:

        # Temp und Luftfeuchte Auslesen
        temp, hum = dht_sensor.read_combined()
        if temp is not None and hum is not None:
            print(f"  DHT11: Temperatur={temp:.1f}°C, Luftfeuchtigkeit={hum:.1f}%")
        else:
            print("  DHT11: Konnte nicht gelesen werden.")
        #Bodenfeuchte Auslesen
        moisture = soil_sensor.get_moisture_percent()
        if moisture is not None:
            print(f"  Bodenfeuchte: {moisture:.1f}%")
        else:
            print("  Bodenfeuchte: Konnte nicht gelesen werden.")

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
        else:
            pump.pump_off()
            print("Pumpe ausgeschaltet.")

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
