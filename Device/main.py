import time
import config
from Pflanzomat.hardware.sensors.dht11_sensor import DHT11Sensor
from Pflanzomat.hardware.sensors.ads1115_soil_moisture_sensor import ADS1115SoilSensor

# Temperatur- und Luftfeuchte Sensor initialisieren
dht_sensor = DHT11Sensor(config.DHT11_PIN)
# Bodenfeuchte Sensor initialisieren
soil_sensor = ADS1115SoilSensor(
    adc_channel=config.SOIL_MOISTURE_ADC_CHANNEL,
    voltage_dry=config.SOIL_MOISTURE_VOLTAGE_DRY,
    voltage_wet=config.SOIL_MOISTURE_VOLTAGE_WET
)

try:
    for i in range(5):

        temp, hum = dht_sensor.read_combined()
        if temp is not None and hum is not None:
            print(f"  DHT11: Temperatur={temp:.1f}°C, Feuchtigkeit={hum:.1f}%")
        else:
            print("  DHT11: Konnte nicht gelesen werden.")


        moisture = soil_sensor.get_moisture_percent()
        if moisture is not None:
            print(f"  Bodenfeuchte: {moisture:.1f}%")
        else:
            print("  Bodenfeuchte: Konnte nicht gelesen werden.")

        time.sleep(3)

except KeyboardInterrupt:
    print("\nTest gestoppt.")
finally:
    print("\nRäume auf...")
    if 'dht_sensor' in locals():
        dht_sensor.cleanup()
    if 'soil_sensor' in locals():
        soil_sensor.cleanup()
    print("Aufgeräumt.")
