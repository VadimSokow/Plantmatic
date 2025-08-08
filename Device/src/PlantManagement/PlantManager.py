import asyncio
import time
from asyncio import Event

import helper.toml as toml
from Mqtt.DeviceClient import DeviceClient
from PlantManagement.Plant import Plant
from PlantManagement.PlantManagerInterface import PlantManagerInterface
from logger import create_logger

from Slot.DeviceSlot import DeviceSlot

logger = create_logger(__name__)


def print_plant_list(plants: list[Plant]):
    for p in plants:
        p.to_string()


class PlantManager(PlantManagerInterface):
    def __init__(self, plant_config_path: str, plant_checkup_interval = 5):
        """
        Initializes the PlantManager with a path to the plant configuration file.
        """
        logger.info(f"Initializing PlantManager with config path: {plant_config_path}")
        self.plant_checkup_interval = plant_checkup_interval
        self.plants: list[Plant] = []
        self.new_plants: list[Plant] = None
        self.deleted_plant_names: list[str] = []
        self.plant_config_path: str = plant_config_path
        self.device_client = None
        self.device_slots = DeviceSlot()

    async def start(self, device_client: DeviceClient, shutdown_event: Event) -> None:
        """
        A function that monitors all the plants in this plantManager once per plant_checkup_interval.
        Checks after monitoring whether the new_plants is changed and updates the plants that will be monitored.
        Sends updated plants with device_client to device_twin.
        :param device_client: The device_client object that will be used to send data to the IoT Hub.
        :param shutdown_event: When the shutdown event is set, this funktion will end.
        """
        logger.info("Starts a coroutine that monitors all plants")
        self.device_client = device_client
        self.plants = self.load_plants(self.plant_config_path)
        while not shutdown_event.is_set():
            await asyncio.sleep(self.plant_checkup_interval)

            #Checks for shutdown event is set
            if shutdown_event.is_set():
                logger.info("Plant Monitoring stoped")
                break
            #Getting current time since 1970
            current_time = time.time()
            for p in self.plants:
                #Checking all the plants of this manager
                p.monitor(device_client, current_time)

                # Autonomous watering of the plant
                if p.current_soil_moisture is not None:
                    #if plant has no slot no real sensor data
                    if p.slot:
                        # check if plant needs watering
                        if p.is_watering_needed(p.current_soil_moisture, current_time):
                            logger.info(f"MANAGER: Starte asynchrone Bewässerung für {p.name}")
                            # start watering the plant (async)
                            asyncio.create_task(p.water_until_target())

            # Checks, if the plants changed
            if self.new_plants is not None:
                logger.info("Plants will be updated to new Plants")
                #set new plants as plants that will be monitored
                self.plants = self.new_plants
                self.new_plants = None

                self.report_updated_plants()


    def report_updated_plants(self):
        """
        Builds a dictionary containing the current plants and the plants that have been deleted.
        The current plants are added as dictionaries using their `to_dict()` method.
        Deleted plants are represented by their names with `None` as values. After that, the list of deleted plant names is cleared.
        The built dictionary will be reported through the device client.
        """
        #
        plants_dict = {}
        for plant in self.plants:
            plants_dict.update(plant.to_dict())

        if self.deleted_plant_names:
            deleted_dict = {name: None for name in self.deleted_plant_names}
            plants_dict.update(deleted_dict)
            self.deleted_plant_names = []

        self.device_client.report_device_twin(plants_dict)



    def push_new_plant_config(self, new_config):
        """
        Updates the plant config toml and new_plants list of the PlantManager Object.
        :param new_config: The updated plants that will be saved in the plant_config_config.
        """
        logger.debug(f"push new config")
        self.update_plant_toml(new_config)
        self.new_plants = self.load_plants(self.plant_config_path)

    def load_plants(self, plant_config_path: str) -> list[Plant]:
        """
        Loads all plants from the plant_config_path and returns them as a List of plant objects.
        :param plant_config_path: The path of the config file that will be loaded
        :return: List of plants
        """
        logger.info(f"Loads plants to objects from: {plant_config_path}")
        plant_list = []
        plant_config = toml.load_file(plant_config_path)

        logger.info(f"Plants read: {plant_config}")
        for name, config in plant_config.items():
            p_name = name
            p_measuring_interval = config.get("measuring_interval")
            p_min_soil_moisture = config.get("minSoilMoisture")
            p_max_soil_moisture = config.get("maxSoilMoisture")
            p_slot_num = config.get("slot_num")
            p_slot = self.device_slots.get_slot(p_slot_num)

            plant_object = Plant(p_name, p_measuring_interval, p_min_soil_moisture, p_max_soil_moisture, p_slot_num, p_slot)
            plant_object.to_string()
            plant_list.append(plant_object)
        return plant_list



    def update_plant_toml(self, new_config):
        """
        Updated the plant config file and adds names from deleted Plants to the deleted_plant_names List.
        :param new_config The new data that will be safed in the plant_config_path from this PlantManager Object.
        """
        logger.info(f"Updating toml with: {new_config}")

        for name, config in new_config.items():

            if config is None:
                logger.debug(f"Deleting section in toml: {name}")
                toml.delete_section_file(path=self.plant_config_path, section=name)
                self.deleted_plant_names.append(name)
                continue
            logger.debug(f"Plant: {name}, with config: {config}")
            if name != "$version":

                for key, value in config.items():
                    logger.debug(
                        f"Plant: {name}, with key: {key}, and value: {value}")
                    okay = toml.update_section_file(self.plant_config_path, name, key, value)
                    if not okay:
                        logger.error(f"An Error during updating toml occurred with plant: {name}")


    def cleanup(self):
        if self.device_slots:
            self.device_slots.cleanup()