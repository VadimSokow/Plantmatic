import json

from azure.iot.device import IoTHubDeviceClient, Message, MethodResponse
from azure.iot.device.iothub.pipeline.pipeline_events_iothub import MethodRequestEvent

from PlantManagement.PlantManagerInterface import PlantManagerInterface
from logger import create_logger

logger = create_logger(__name__)


class DeviceClient:
    def __init__(self, config: dict[str, any], plant_manager:PlantManagerInterface): # plant_helper:Plant_Config_Helper_Object
        self.config: dict[str, any] = config
        self.plant_manager = plant_manager
        self.device_client = self.get_device_client()
        


    def get_device_client(self) -> IoTHubDeviceClient:
        """
        Returns connected device_client with config from config.toml (websockets, ConnectionString)
        :return: connected, configured IoTHubDeviceClient or None if connecting was not successful.
        """
        logger.info("Creating DeiceClient")
        connection_string = self.config["Connection"]["Connection_String"]
        websockets = self.config["Connection"]["Websockets"]
        device_client = IoTHubDeviceClient.create_from_connection_string(connection_string,
                                                                         websockets=websockets)  # erstellt device_client

        try:
            #connect to IoT Hub
            logger.info("Connecting")
            device_client.connect()
            logger.info("Connected")
            #add functions to handle requests on device_clients
            device_client.on_twin_desired_properties_patch_received = self.twin_patch_handler
            logger.info("DeviceClient created successfully")
            return device_client
        except Exception as e:
            logger.error("Fehler beim verbinden " + e)
            return None



    def twin_patch_handler(self, patch):
        """
        Function that will be called when something changed in the device twin in IoTHub.
        """
        logger.info(f"received new config {patch}")
        self.plant_manager.push_new_plant_config(patch)


    def report_device_twin(self, patch:dict):
        """
        Reports the given data to the device twin in the IoTHub.
        :param patch: JSON dict that will be reported.
        """
        logger.info(f"report to device twin: {patch}")
        self.device_client.patch_twin_reported_properties(patch)


    def send_message(self, measurement_data: str):
        """
        Sends a message containing the provided measurement data using the device client.
        :param measurement_data: The measurement data to be sent as a message.
        """
        logger.info(f"sending message: {measurement_data}")
        message = Message(measurement_data)
        try:
            self.device_client.send_message(message)
        except Exception as e:
            logger.error(f"Fehler beim senden der Message {e}")



    def disconnect_device_client(self):
        """
        Disconnects the client from the IoT Hub.
        """
        self.device_client.disconnect()
        logger.info("Device Client Disconnected successfully")




