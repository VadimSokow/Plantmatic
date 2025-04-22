import config
from Pflanzomat.hardware.sensors.dht11_sensor import DHT11Sensor

dht_sensor = DHT11Sensor(
    config.DHT11_PIN)
print(dht_sensor.read_combined())

dht_sensor.cleanup()

s = "Hello World!"
s.strip('H')