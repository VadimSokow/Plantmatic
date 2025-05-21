from Device.Mqtt.Device_Client import Device_Client
from Device.Config.useToml import load_toml_config
from random import Random, randint
import json
import time

from Device.Pflanzomat.hardware.sensors import dht11_sensor, ads1115_soil_moisture_sensor

pin_config_toml_path = ""  # TODO der Pfad zur Datei .toml automatisch finden
plant_config_toml_path = ""
connection_config_toml_path = ""


class Plant_Management_Device():

    def __init__(self):
        self.pin_config = load_toml_config(pin_config_toml_path)
        self.connection_config = load_toml_config(connection_config_toml_path)
        self.plant_config = load_toml_config(plant_config_toml_path)
        self.device_client = Device_Client(self.connection_config, plant_config_toml_path)
        self.list_of_plants = self.load_plants()

    def load_plants(self):
        print("<load_plants>")
        print("</load_plants>")

    def start_measuring(self):
        if self.device_client is None:
            print("Error with device_client (client is None)")
            # Verbindung später nocheinmal suchen
        try:
            while True:
                print("---------------------------------------------------------------------------")
                measuring_interval = self.get_measuring_interval()
                time.sleep(measuring_interval)

                # Wenn sich der Twin zum Device_client in der Cloud ändert wird die variable durch den twin_patch_handler auf True gesetzt
                if (self.device_client.plant_config_hasChanged):
                    self.reload_plant_toml()

                measure_data = get_measurement_test_data()
                self.device_client.send_message(measure_data)
                print("##############################################################")
        except KeyboardInterrupt:
            print("Stop")
        finally:
            self.device_client.disconnect_device_client()

    def reload_plant_toml(self):
        '''
        Loads plant_config.toml and sets self.plant_config to this new config. Changes device_client.plant_config_hasChanged back to False.
        '''
        print("<reload_plant_toml>")
        self.plant_config = load_toml_config(plant_config_toml_path)
        self.device_client.plant_config_hasChanged = False
        print("</reload_plant_toml>")

    def get_measuring_interval(self) -> int:
        '''
        Gets and returns the measuring_interval from self.plant_config. If value could not be read or value is not an end it will return 10.
        :return: measuring_interval from self.plant_config or 10.
        '''
        print("<get_measuring_interval>")
        try:
            measuring_interval = self.plant_config["plant_config"]["measuring_interval"]  # keyError wenn nicht da
            if not isinstance(measuring_interval, int):
                print("measuring_interval is not an int")
                measuring_interval = 10
        except KeyError:
            print("measuring_interval could not be read from config (uses default value)")
            measuring_interval = 10
        finally:
            # print(f"DAS IST INTERVAL______{measuring_interval}")
            return measuring_interval


def get_measurement_data():
    last_watered = time.time()
    temperature_celsius, humidity_percent = dht11_sensor.read_combined(),
    soil_moisture_percent = ads1115_soil_moisture_sensor.get_moisture_percent(),
    light_level_percent = 42,  # TODO WO Lichtsensor?

    measurement_data = {"last_watered": last_watered, "temperature_celsius": temperature_celsius,
                        "humidity_percent": humidity_percent,
                        "soil_moisture_percent": soil_moisture_percent, "light_level_percent": light_level_percent}
    return json.dumps(measurement_data)


def get_measurement_test_data():
    '''
    Returns Json with test data.
    '''
    last_watered = time.time()
    temperature_celsius = randint(0, 10)
    humidity_percent = randint(0, 10)
    soil_moisture_percent = randint(0, 10)
    light_level_percent = randint(0, 10)

    measurement_data = {"last_watered": last_watered, "temperature_celsius": temperature_celsius,
                        "humidity_percent": humidity_percent,
                        "soil_moisture_percent": soil_moisture_percent, "light_level_percent": light_level_percent}
    return json.dumps(measurement_data)

# Bewässerung muss Pflanze mitgeben
# Dann wird Pumpe gesteuert so wie es in condig steht
