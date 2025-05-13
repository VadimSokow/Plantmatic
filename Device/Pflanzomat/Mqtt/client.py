import json
import time

from ..hardware.sensors import dht11_sensor, ads1115_soil_moisture_sensor
from ...useToml import load_toml_config, update_toml
from random import Random, randint

from azure.iot.device import IoTHubDeviceClient, Message, MethodResponse
from azure.iot.device.iothub.pipeline.pipeline_events_iothub import MethodRequestEvent


def get_device_Client() -> IoTHubDeviceClient:
    '''
    Returns device_client with config from config.toml (websockets, ConnectionString)
    '''
    config = load_toml_config()
    connection_string = config["Connection"]["Connection_String"]
    websockets = config["Connection"]["Websockets"]
    device_client = IoTHubDeviceClient.create_from_connection_string(connection_string, websockets=websockets) #erstellt device_client
    device_client.on_twin_desired_properties_patch_received = twin_patch_handler
    device_client.on_method_request_received = method_request_handler
    try:
        print('Connecting')
        device_client.connect() #Baut verbindung zum Device im IoT hub auf
        print('Connected')
        return device_client
    except Exception as e:
        print("Fehler beim verbinden " + e)
        return None


def method_request_handler(method_request: MethodRequestEvent):
    '''
    The Function that is called when the IoT Hub sends a direct methode Request.
    If the function given in the methode_request is watering_sec or watering_perc the functions with this names will be called with the payload of methode_request.
    Sends Response to IoTHub before watering:
        200 name and payload was okay
        404 name of function was wrong
        400 payload was not an int
    '''
    print(f"Methodenaufruf empfangen: {method_request.name} payload: {method_request.payload}")
    methode_is_ok = True
    payload = {"result": True, "message": "Bewässerung gestartet."}
    status = 200

    if method_request.name != "watering_sec" and method_request.name != "watering_perc":
        print(f"Methode not found {method_request.name}")
        methode_is_ok = False
        payload = {"result": False, "message": "Methode not found."}
        status = 404

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
        device_client.send_method_response(method_response)
        print("Senden erfolgreich")

        # Start watering
        if methode_is_ok:
            if method_request.name == "watering_sec":
                watering_sec(method_request.payload)
            if method_request.name == "watering_perc":
                watering_perc(method_request.payload)

    except Exception as e:
        print(f"Fehler beim antworten {e}")


def twin_patch_handler(patch):
    '''
    Function that will be called when something changed in the device twin in IoTHub and at Initialise of this Skript.
    '''
    print("Desired properties patch received:")
    print(patch)
    # data = patch["max_humidity"]
    # update_toml("plant_config","max_humidity", data)


# TODO Twin zum laufen bringe TOML und TOMLI entschieden.
# def twin_report():
#    reported_properties_patch = { "humidity": None, "soil_moisture": 788, "temperature": 1, "light_intensity": 5}
#    device_client.patch_twin_reported_properties(reported_properties_patch) #fügt neue tags hinzu und ersetzt die Werte in denen die er kennt. Nicht aktualisierte bleiben erhalten.
# Zum löschen eines Tags auf None setzen


def send_message(measurement_data: str):
    print(f"{measurement_data}")
    message = Message(measurement_data)
    try:
        device_client.send_message(message)
        print('Message send')
    except Exception as e:
        print(f"Fehler beim senden der Message {e}")
        # hier nochmal versuchen


def get_measurement_data():
    last_watered = time.time()
    temperature_celsius, humidity_percent = dht11_sensor.read_combined(),
    soil_moisture_percent = ads1115_soil_moisture_sensor.get_moisture_percent(),
    light_level_percent = 42,  # TODO WO Lichtsensor?

    measurement_data = {"last_watered": last_watered, "temperature_celsius": temperature_celsius,
                        "humidity_percent": humidity_percent,
                        "soil_moisture_percent": soil_moisture_percent, "light_level_percent": light_level_percent}
    return json.dumps(measurement_data)


def watering_sec(sec: int):
    # TODO wie steuer ich die Pumpe?
    print("Bewässerung läuft für Sekunden")


def watering_perc(perc: int):
    # Bewässern bis Prozent Bodenfeuchte
    print("Bewässerung läuft bis Bodenfeuchte")


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


# Main
device_client = get_device_Client()
config = load_toml_config()
interval = config["plant_config"]["measuring_interval"]

if device_client is None:
    print("Error with device_client (client is None)")
    # Verbindung später nocheinmal suchen
try:
    while True:
        time.sleep(interval)
        print("---------------------------------------------------------------------------")
        measure_data = get_measurement_test_data()
        # send_message(messure_data)
        print("###############")
except KeyboardInterrupt:
    print("Stop")
finally:
    device_client.disconnect()

    #pip install azure-iot-device
    #pip install toml (in neueren Versionen von Python schon dabei, aber man weiß ja nie) import von Toml != Tomli (Funktionen anscheinend anders)
    #Funktinoiert nicht?
    #Pfad zu conig. toml prüfen in unsToml.py
    #ConectionString in config.toml einfügen
