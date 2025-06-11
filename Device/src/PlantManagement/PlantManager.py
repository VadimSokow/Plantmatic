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


def print_plant_list(
        plants:
        list[Plant]):
    for p in plants:
        p.to_string()


class PlantManager(
    PlantManagerInterface):
    def __init__(
            self,
            plant_config_path: str):
        """
        Initializes the PlantManager with a path to the plant configuration file.
        """
        logger.info(
            f"Initializing PlantManager with config path: {plant_config_path}")
        self.plants: \
        list[
            Plant] = []
        self.new_plants: \
        list[
            Plant] = None
        self.deleted_plant_names: \
        list[
            str] = []
        self.plant_config_path: str = plant_config_path
        self.device_client = None
        self.device_slots = DeviceSlot()

    async def start(self,device_client: DeviceClient,shutdown_event: Event) -> None:
        logger.info("Starts a coroutine that monitors all plants")
        self.device_client = device_client
        self.plants = self.load_plants(self.plant_config_path)
        while not shutdown_event.is_set():
            await asyncio.sleep(1)
            # in alle Pflanzen gucken, ob ihr intervall abgelaufen ist und sie geprüft werden müssen
            if shutdown_event.is_set():  # Nach dem Sleep nochmals prüfen
                break
            current_time = time.time()  # Die aktuelle Zeit in Sekunden von 1970 als Float
            for p in self.plants:
                # für jede Pflanze in plants gucken, ob der unterschied zwischen der letzten Messung und der jetztigen Zeit größer ist, als der Intervall.
                # wenn, ja dann wird eine Messung ausgelöst
                p.monitor(device_client,current_time)

            # Prüft, ob sich an den Pflanzen etwas geändert hat
            if self.new_plants:
                logger.info("Plants will be updated to new Plants")
                self.plants = self.new_plants
                self.new_plants = None
                # device twin aktualisieren, da jetzt die config des Raspi aktualisiert wurde
                # was tun, wenn die Pflanze gelöscht ist?

                plants_dict = {}
                for plant in self.plants:
                    plants_dict.update(
                        plant.to_dict())

                if self.deleted_plant_names is not None:
                    deleted_dict = {
                        name: None
                        for
                        name
                        in
                        self.deleted_plant_names}
                    plants_dict.update(
                        deleted_dict)
                    self.deleted_plant_names = []
                self.device_client.report_device_twin(
                    plants_dict)

    def push_new_plant_config(
            self,
            new_config):
        logger.debug(
            f"push new config")
        self.update_plant_toml(
            new_config)
        self.new_plants = self.load_plants(self.plant_config_path)

    def load_plants(self,plant_config_path: str) -> list[Plant]:
        logger.info(f"Loads plants to objects from: {plant_config_path}")
        plant_list = []
        plant_config = toml.load_file(plant_config_path)

        logger.info(f"Plants read: {plant_config}")
        for name, config in plant_config.items():
            p_name = name
            p_measuring_interval = config.get("measuring_interval")
            p_min_humidity = config.get("min_humidity")
            p_max_humidity = config.get("max_humidity")
            p_slot_num = config.get("slot_num")
            p_slot = self.device_slots.get_slot(p_slot_num)

            plant_object = Plant(p_name,p_measuring_interval,p_min_humidity,p_max_humidity,p_slot_num,p_slot)
            plant_object.to_string()
            plant_list.append(plant_object)

        return plant_list

    def update_plant_toml(
            self,
            patch):
        logger.info(
            f"Updating toml with: {patch}")

        for name, config in patch.items():

            if config is None:
                logger.debug(
                    f"Deleting section in toml: {name}")
                toml.delete_section_file(
                    path=self.plant_config_path,
                    section=name)
                self.deleted_plant_names.append(
                    name)
                continue
            logger.debug(
                f"Plant: {name}, with config: {config}")
            if name != "$version":

                for key, value in config.items():
                    logger.debug(
                        f"Plant: {name}, with key: {key}, and value: {value}")
                    okay = toml.update_section_file(
                        self.plant_config_path,
                        name,
                        key,
                        value, )
                    if not okay:
                        logger.error(
                            f"An Error during updating toml occured with plant: {name}")
