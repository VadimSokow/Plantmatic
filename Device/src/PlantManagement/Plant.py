import asyncio
import json
import time
from asyncio import Task
from random import randint

from Mqtt.DeviceClient import DeviceClient
from logger import create_logger

from Slot.slot import Slot

logger = create_logger(__name__)


class Plant:
    def __init__(self, name: str, measuring_interval: int, min_soil_moisture: int, max_soil_moisture: int, slot_num: int,
                 slot: Slot):
        """
        Initialize a Plant with provided values.
        :param name: The name of the Plant.
        :param measuring_interval: The measuring interval in seconds.
        :param min_humidity: The min soil moisture. Below that, watering is required.
        :param max_humidity: The max soil moisture. Above that, watering must turn off.
        :param slot_num: The slot number of the Plant.
        :param slot: The slot object corresponding to the slot_num
        """
        self.name = name
        self.measuring_interval = measuring_interval
        self.min_soil_moisture = min_soil_moisture
        self.max_soil_moisture = max_soil_moisture
        self.slot_num = slot_num
        self.monitoring: Task | None = None
        self.last_monitored: float = 0  # In sekunden von 1970
        self.slot: Slot = slot  # if slot_num has no slot in DeviceSlot than None

        # Variables for autonomous pump logic
        self.is_currently_watering: bool = False  # true when plant is currently watered
        self.last_pump_time: float = 0  # for watering cooldown
        self.cooldown_duration = 60 * 10  # 10 minutes cooldown between watering cycles
        self.current_soil_moisture: float | None = None

    def to_string(self) -> str:
        """
        Converts a Plant with name, measuring interval, min and max humidity and slot number into a string.
        :return: A string that represents the Plant.
        """
        return f"Plant(Name: {self.name}, Measuring_interval: {self.measuring_interval}, Min_soil_moisture: {self.min_soil_moisture}, Max_soil_moisture: {self.max_soil_moisture})"

    def to_dict(self) -> dict:
        """
        Converts this plant with name, measuring interval, min and max humidity and slot number into a dictionary.
        :return: A dict that represents this plant.
        """
        logger.info(f"Make dict from plant{self.name}")
        data = {
            self.name: {
                "measuring_interval": self.measuring_interval,
                "minSoilMoisture": self.min_soil_moisture,
                "maxSoilMoisture": self.max_soil_moisture,
                "slot_num": self.slot_num
            }
        }
        return data

    async def water_until_target(self) -> None:
        """
        Method for watering the plant to the configuration soil moisture.
        :return:
        """
        if self.is_currently_watering:
            logger.info(f"({self.name}) Bewässerung läuft bereits, überspringe neuen Start.")
            return

        logger.info(f"AUTONOM ({self.name}): Starte Bewässerungszyklus (Ziel > {self.max_soil_moisture}%).")
        self.is_currently_watering = True
        self.last_pump_time = time.time() # set cooldown timer

        max_watering_cycles = 5  # pump x times
        pump_increment_duration = 2.0  # pump for x seconds
        wait_after_pump = 15.0  # wait time between pumpy cycles

        for cycle in range( max_watering_cycles):
            if not self.is_currently_watering:
                logger.info(f"({self.name}) Bewässerung extern abgebrochen.")
                break
            logger.info(f"({self.name}) Bewässerungszyklus {cycle + 1}/{max_watering_cycles}...")

            if self.slot and self.slot.pump:
                # pump for specified time
                self.slot.pump.pump_on()
                await asyncio.sleep(pump_increment_duration)
                self.slot.pump.pump_off()
            else:
                logger.error(f"({self.name}) Keine Pumpe im Slot zum Bewässern gefunden.")
                break
            # wait for water to sink
            logger.info(f"({self.name}) Warte {wait_after_pump}s...")
            await asyncio.sleep(wait_after_pump)

            # measure soil moisture
            if self.slot and self.slot.soil_sensor:
                current_moisture = self.slot.soil_sensor.get_moisture_percent()
            else:
                current_moisture = None

            logger.info(f"({self.name}) Neue Messung nach dem Pumpen: {current_moisture if current_moisture is not None else 'FEHLER'}%")

            if current_moisture is None:
                logger.warning(f"({self.name}) Sensorwert während des Wässerns verloren. Breche ab.")
                break

            # check measured soil moisture
            if current_moisture >= self.max_soil_moisture:
                logger.info(f"({self.name}) Ziel-Feuchtigkeit ({self.max_soil_moisture}%) erreicht. Stoppe Bewässerung.")
                break
        else:
            logger.warning(f"({self.name}) Bewässerungszyklus nach {max_watering_cycles} Zyklen beendet. Ziel nicht erreicht. Mache eine längere Pause (Cooldown).")

        self.is_currently_watering = False

    def is_watering_needed(self,soil_moisture: float,current_time: float) -> bool:
        """
        Checks if the plant can be watered.
        :param soil_moisture: Target soil moisture in percent.
        :param current_time: Current time in seconds since epoch.
        :return: True if the plant can be watered.
        """
        #if sensor has an error
        if soil_moisture < 0:
            return False
        # soil moisture not low enough
        if soil_moisture >= self.min_soil_moisture:
            return False
        # there is still a cooldown for watering
        if (current_time - self.last_pump_time) < self.cooldown_duration:
            return False
        # System is already watering
        if self.is_currently_watering:
            return False
        return True

    def monitor(self, device_client: DeviceClient, current_time: float) -> None:
        """
        This function checks if the difference between the current_time and the time this plant was measured is greater than the measuring_interval of this plant,
        If so, the plant will be measured, and the telemetry is sent using the Device_Client.
        :param device_client: The device client to push data into the cloud.
        :param current_time: The time at which this function is called.
        """
        # Checks if enough time has passed
        logger.info(f"Check interval of Plant: {self.name}")
        if current_time - self.last_monitored < self.measuring_interval:
            return

        logger.info(f"Starts monitoring for plant: {self.name}")
        measure_data = self.measure_and_create_message()

        device_client.send_message(measure_data)
        self.last_monitored = current_time
        logger.info(f"End of monitoring for plant: {self.name}")

    def measure_and_create_message(self):
        """
        Creates a message to send to the cloud. It contains sensor values like temperature.
        If the plant has a slot object, this will send sensordata. If the plant has no slot object, this will send random "testdata".
        :return: Measured data in JSON format
        """

        # {"PLANZEN_NAME" : {"last_watered": 1748859304.620811, "temperature_celsius": 6, "humidity_percent": 4, "soil_moisture_percent": 10, "light_level_percent": 10}} //TODO was hiermit?
        if self.slot is not None:
            #When the plant has a slot object, a message will be built using the sensor data from the slot.
            logger.info(f"creating Message from Slot for {self.name}")
            measurement_data = self.slot.get_all_sensor_values()
            # save the last measured soil moisture
            if measurement_data:
                self.current_soil_moisture = measurement_data.get("soil_moisture_percent")
            else:
                self.current_soil_moisture = None
            data = {f"{self.name}": measurement_data}
            data = json.dumps(data)
        else:
            # When the plant has no slot object, a message will be built using test data.
            logger.info(f"Creating Message without Slot for {self.name}")
            measurement_data = get_measurement_test_data()
            # save the last measured soil moisture
            if measurement_data:                #TODO bessern werden kann nur mit slot --> da kein slot ist braucht man auch kein current soil moisture speichern?
                self.current_soil_moisture = measurement_data.get("soil_moisture_percent")
            else:
                self.current_soil_moisture = None
            data = {f"{self.name}": measurement_data}
            data = json.dumps(data)
        logger.debug(f"Created Message : {data}")
        return data


def get_measurement_test_data():
    """
    Generates random test values for temperature, humidity, soil moisture, and light intensity.
    The values are integers between 0 and 10 and are returned as a dictionary.
    :return: A dictionary containing randomly generated measurement data.
    """

    logger.info("creating message with dummy data")
    temperature_celsius = randint(0, 10)
    humidity_percent = randint(0, 10)
    soil_moisture_percent = randint(0, 10)
    light_level_lux = randint(0, 10)

    measurement_data = {"temperature_celsius": temperature_celsius,
                        "humidity_percent": humidity_percent,
                        "soil_moisture_percent": soil_moisture_percent, "light_level_lux": light_level_lux}
    return measurement_data
