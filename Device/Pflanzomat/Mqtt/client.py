import os
import json
import time
from random import Random, randint


# https://pypi.org/project/azure-iot-device/
from azure.iot.device import IoTHubDeviceClient, Message, MethodResponse
from dotenv import load_dotenv

load_dotenv()  # loads .env for access to enviroment variables
connection_string = os.getenv('CONNECTION_STRING')



def send_message(connection_string,messurment_data, websockets):
    """
    Baut eine Verbindung zu einem Device im IoTHub auf.
    :param messurment_data: Daten die an IoTHub gesendet werden
    :param websockets: True/False ob Mqtt über WebSockets (Port: 443) Statt Mqtt (8883) verwendet werden soll
    :param connection_string: Primärere Connection String des Devices an das die Message geschickt werden soll.
    :return:
    """
    device_client = IoTHubDeviceClient.create_from_connection_string(connection_string, websockets=websockets)
    print('Connecting')
    device_client.connect()
    print('Connected')
    message = Message(messurment_data)
    device_client.send_message(message)
    print('Message send')


def get_measurement_test_data():
    """
    String fertig für json.dumps()
    :return: String mit Random Daten für humidity, soil_moisture, temperature, light_intensity
    """
    humidity = randint(0, 10)
    soil_moisture = randint(0, 10)
    temperature = randint(0, 10)
    light_intensity = randint(0, 10)

    measurement_data = {"humidity": humidity, "soil_moisture": soil_moisture, "temperature": temperature,
                        "light_intensity": light_intensity}
    return measurement_data


def build_json(humidity, soil_moisture, temperature, light_intensity):
    measurement_data = {"humidity": humidity, "soil_moisture": soil_moisture, "temperature": temperature,
                        "light_intensity": light_intensity}
    return json.dumps(measurement_data)


def patch_twin(messurment_data, websockets):
    """
    :param messurment_data:
    :param websockets:
    :return:
    """
    device_client = IoTHubDeviceClient.create_from_connection_string(connection_string, websockets=websockets)
    device_client.on_twin_desired_properties_patch_received = twin_patch_handler
    print('Connecting')
    device_client.connect()
    print('Connected')
    reported_properties_patch = {'Feuchtigkeit': 65, 'Temperatur': 25}
    device_client.patch_twin_reported_properties(reported_properties_patch)
    print("reported Properties eurden erfolgreich gesendet")
    # ding = (device_client.receive_twin_desired_properties_patch())
    # print(ding)


def twin_patch_handler(patch):
    """
    Funktion die aufgerufen wird, wenn Subscription getriggert wird.
    :param patch: Alles was im Device twin bei $desired drin steht außer $metadata -> z.B{'$version': 17, 'Feuchtigkeit': 500, 'Temperatur': 25}
    :return:
    """
    print("Desired properties patch received:")
    print(patch)


def main():
    websockets = True
    device_client = IoTHubDeviceClient.create_from_connection_string(connection_string, websockets=websockets)
    device_client.on_twin_desired_properties_patch_received = twin_patch_handler #Funktion die aufgerufen wird, wenn device inhalt sich ändert
    print('Connecting')
    device_client.connect()
    print('Connected')
    try:
        while True:
            time.sleep(5)
            print("---------------------------------------------------------------------------")
            reported_properties_patch = get_measurement_test_data()
            #reported_properties_patch = { "humidity": None, "soil_moisture": 788, "temperature": 1, "light_intensity": 5}
            device_client.patch_twin_reported_properties(reported_properties_patch) #fügt neue tags hinzu und ersetzt die Werte in denen die er kennt. Nicht aktualisierte bleiben erhalten.
            #Zum löschen eines Tags auf None setzen
            print("properties aktuell:")
            device_twin = device_client.get_twin()
            print(device_twin)  # device twin ist nur ein Json Objekt

    except KeyboardInterrupt:
        print("Stop")
    finally:
        device_client.disconnect()

main()
# messurment_data = get_measurement_data()
# send_message(messurment_data)



# Protokolle und ihre Ports
# https://learn.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-protocols

# Beispiel zum versenden um Empfangen von Nachrichten mit mqtt
# https://learn.microsoft.com/en-us/azure/iot/iot-mqtt-connect-to-iot-hub#use-the-device-sdks

# Device Twins
# https://learn.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins

# Python SDK IoTHubDeviceClient Doku
# https://learn.microsoft.com/de-de/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?view=azure-python#azure-iot-device-iothubdeviceclient-receive-twin-desired-properties-patch
