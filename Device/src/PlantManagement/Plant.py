import asyncio
import json
import time
from asyncio import Task
from random import randint

from Device.src.Mqtt.DeviceClient import DeviceClient
from Device.src.logger import create_logger

logger = create_logger(__name__)


class Plant:
    def __init__(self, name: str, measuring_interval: int, min_humidity: int, max_humidity: int, slot_num: int):
        """
        Initialize a Plant with provided values.
        :param name: The name of the Plant.
        :param measuring_interval: The measuring interval in seconds (also used for sleep in coroutine).
        :param min_humidity: The min soil moisture. Below that, watering is required.
        :param max_humidity: The max soil moisture. Above that, watering must turn off.
        :param slot_num: The slot number of the Plant.
        """
        self.name = name
        self.measuring_interval = measuring_interval
        self.min_humidity = min_humidity
        self.max_humidity = max_humidity
        self.slot_num = slot_num
        self.monitoring: Task | None = None
        self.last_monitored : float = 0 #In sekunden von 1970

    def to_string(self) -> str:
        """
        Converts a Plant into a string.
        :return: A string that represents the Plant.
        """
        return f"Plant(Name: {self.name}, Measuring_interval: {self.measuring_interval}, Min_humidity: {self.min_humidity}, Max_humidity: {self.max_humidity})"

    def to_dict(self) -> dict:
        logger.info(f"Make dict from plant{self.name}")
        data = {
            self.name: {
                "measuring_interval": self.measuring_interval,
                "min_humidity": self.min_humidity,
                "max_humidity": self.max_humidity,
                "slot_num": self.slot_num
            }
        }
        return data

    def monitor(self, device_client: DeviceClient, current_time : float) -> None:
        """
        The monitor function. It will run until the coroutine is killed.
        :param device_client: The device client to push data into the cloud.
        :param current_time: Hallo
        """
        #Prüfen, ob schon genug Zeit vergangen ist
        logger.info(f"Check interval of Plant: {self.name}")
        if current_time - self.last_monitored < self.measuring_interval:
            return

        logger.info(f"Starts monitoring for plant: {self.name}")
        measure_data = self.create_message()
        device_client.send_message(measure_data)
        self.last_monitored = current_time
        logger.info(f"End of monitoring for plant: {self.name}")

    def create_message(self):
        """
        Creates a message to send to the cloud. It contains sensor values like temperature.
        :return: The message for the Azure IoTHub.
        """
        logger.info("creating message with dummy data")
        # {"PLANZEN_NAME" : {"last_watered": 1748859304.620811, "temperature_celsius": 6, "humidity_percent": 4, "soil_moisture_percent": 10, "light_level_percent": 10}}
        measurement_data = get_measurement_test_data()
        data = {f"{self.name}": measurement_data}
        data = json.dumps(data)
        # print(data)
        return data

    def __eq__(self, other):
        if not isinstance(other, Plant):
            return False
        return (self.name == other.name
                and self.measuring_interval == other.measuring_interval
                and self.min_humidity == other.min_humidity
                and self.max_humidity == other.max_humidity
                and self.slot_num == other.slot_num)

    def __hash__(self):
        return hash(self.name)


def get_measurement_test_data():
    """
    Generate some random values, which can be fed into the Azure IoTHub.
    :return: Random data.
    """
    last_watered = time.time()
    temperature_celsius = randint(0, 10)
    humidity_percent = randint(0, 10)
    soil_moisture_percent = randint(0, 10)
    light_level_percent = randint(0, 10)

    measurement_data = {"last_watered": last_watered, "temperature_celsius": temperature_celsius,
                        "humidity_percent": humidity_percent,
                        "soil_moisture_percent": soil_moisture_percent, "light_level_percent": light_level_percent}
    return measurement_data
