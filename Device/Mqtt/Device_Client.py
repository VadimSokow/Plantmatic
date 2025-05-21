# from ..hardware.sensors import dht11_sensor, ads1115_soil_moisture_sensor
from Device.Config.useToml import update_toml, load_toml_config
from Device.Pflanzomat.interfaces import actuator_interface
from azure.iot.device import IoTHubDeviceClient, Message, MethodResponse
from azure.iot.device.iothub.pipeline.pipeline_events_iothub import MethodRequestEvent

from Device.Pflanzomat.interfaces.actuator_interface import ActuatorInterface


class Device_Client():
    def __init__(self, config: dict[str, any], plant_toml_path:str):
        self.config: dict[str, any] = config
        self.plant_toml_path = plant_toml_path
        self.device_client = self.get_device_Client()
        self.plant_config_hasChanged = False


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
        print("<twin_patch_handler>")
        print(patch)
        for key, value in patch.items():

            print(self.plant_toml_path)
            okay = update_toml("plant_config", key, value, self.plant_toml_path)
            if(not okay):
                print("Beim upadten der Toml ist etwas schief gelaufen (twin patch handler)")
        self.plant_config_hasChanged = True
        self.twin_report()
        print("</twin_patch_handler>")


    def twin_report(self):
        print("<twin_report>")
        plant_config = load_toml_config(self.plant_toml_path)
        plant_config_raw = plant_config["plant_config"]
        plant_config_clean = {k: v for k, v in plant_config_raw.items() if k != "$version"} #keine $version in Device Twin weil reserviert
        print("plant_config_clean Inhalt:", plant_config_clean)
        self.device_client.patch_twin_reported_properties(plant_config_clean)
        # fügt neue tags hinzu und ersetzt die Werte in denen die er kennt. Nicht aktualisierte bleiben erhalten.
        # Zum löschen eines Tags auf None setzen
        print("</twin_report>")


    def send_message(self, measurement_data: str):
        print("<send_message>")
        print(f"{measurement_data}")
        message = Message(measurement_data)
        try:
            self.device_client.send_message(message)
        except Exception as e:
            print(f"Fehler beim senden der Message {e}")
            # hier nochmal versuchen
        print("</send_message>")


    def disconnect_device_client(self):
        self.device_client.disconnect()
        print("Device Client Disconnected")



    #ab hier kommt in extra skript

    def watering_sec(sec: int):
        # TODO wie steuer ich die Pumpe?
        print("Bewässerung läuft für Sekunden")

    def watering_perc(perc: int):
        # Bewässern bis Prozent Bodenfeuchte
        print("Bewässerung läuft bis Bodenfeuchte")



    # pip install azure-iot-device
    # pip install toml (in neueren Versionen von Python schon dabei, aber man weiß ja nie) import von Toml != Tomli (Funktionen anscheinend anders)




