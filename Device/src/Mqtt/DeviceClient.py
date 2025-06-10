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
        self.device_client = self.get_device_Client()
        


    def get_device_Client(self) -> IoTHubDeviceClient:
        '''
        Returns device_client with config from config.toml (websockets, ConnectionString)
        '''
        print("<get_device_Client>")
        connection_string = self.config["Connection"]["Connection_String"]
        websockets = self.config["Connection"]["Websockets"]
        device_client = IoTHubDeviceClient.create_from_connection_string(connection_string,
                                                                         websockets=websockets)  # erstellt device_client

        try:
            print('Connecting')
            device_client.connect()  # Baut verbindung zum Device im IoT hub auf
            print('Connected')
            device_client.on_twin_desired_properties_patch_received = self.twin_patch_handler
            device_client.on_method_request_received = self.method_request_handler
            return device_client
            print("</get_device_Client>")
        except Exception as e:
            print("Fehler beim verbinden " + e)
            return None

    def method_request_handler(self, method_request: MethodRequestEvent):
        '''
        The Function that is called when the IoT Hub sends a direct methode Request.
        If the function given in the methode_request is watering_sec or watering_perc the functions with this names will be called with the payload of methode_request.
        Sends Response to IoTHub before watering:
            200 name and payload was okay
            404 name of function was wrong
            400 payload was not an int
        '''
        print("<method_request_handler>")
        print(f"Methodenaufruf empfangen: {method_request.name} payload: {method_request.payload}")
        methode_is_ok = True
        payload = {"result": True, "message": "Bewässerung gestartet."}
        status = 200

        if method_request.name != "watering_sec" and method_request.name != "watering_perc":
            print(f"Methode not found {method_request.name}")
            methode_is_ok = False
            payload = {"result": False, "message": "Methode not found."}
            status = 404

        #Hier Pflanze aus Json nehmen und später an die entsprechende Bewässerungsmethode übergeben

        if not isinstance(method_request.payload, int):
            print(f"Payload not right {method_request.payload}")
            methode_is_ok = False
            payload = {"result": False, "message": "Payload is not valide."}
            status = 400  # Bad Request

        # Antwort an IoT Hub senden
        method_response = MethodResponse.create_from_method_request(
            method_request, status, payload
        )

        try:
            self.device_client.send_method_response(method_response)
            print("Senden erfolgreich")

            # Start watering
            if methode_is_ok:
                if method_request.name == "watering_sec":
                    self.watering_sec(method_request.payload)  # TODO ersetzen durch funktionen
                if method_request.name == "watering_perc":
                    self.watering_perc(method_request.payload)
            print("</method_request_handler>")
        except Exception as e:
            print(f"Fehler beim antworten {e}")
            print("</method_request_handler>")


    def twin_patch_handler(self, patch):
        '''
        Function that will be called when something changed in the device twin in IoTHub.

        '''
        logger.info(f"received new config {patch}")
        self.plant_manager.push_new_plant_config(patch)


    def report_device_twin(self, patch):
        logger.info(f"report to device twin: {patch}")
        self.device_client.patch_twin_reported_properties(patch)


    def send_message(self, measurement_data: str):
        logger.info(f"sending message: {measurement_data}")
        message = Message(measurement_data)
        try:
            self.device_client.send_message(message)
        except Exception as e:
            logger.error(f"Fehler beim senden der Message {e}")
            # hier nochmal versuchen


    def disconnect_device_client(self):
        self.device_client.disconnect()
        print("Device Client Disconnected")



    def watering_sec(sec: int):
        # TODO wie steuer ich die Pumpe?
        print("Bewässerung läuft für Sekunden")

    def watering_perc(perc: int):
        # Bewässern bis Prozent Bodenfeuchte
        print("Bewässerung läuft bis Bodenfeuchte")
