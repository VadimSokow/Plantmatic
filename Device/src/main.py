import asyncio
import os
import signal
import sys

import helper.toml as toml
from Mqtt.DeviceClient import DeviceClient
from PlantManagement.PlantManager import PlantManager
from logger import create_logger

logger = create_logger(__name__)

config_plant_file = "plant_config.toml"
config_connection_file = "connection_config.toml"

# Globale Variable, um das Beenden des Programms zu signalisieren
shutdown_event = asyncio.Event()

plant_manager = None

def get_config_path() -> str:
    """
    Returns the path to the config directory, which is one level above the current file's directory.
    :return: str - Path to the config directory.
    """
    main_path = os.path.abspath(__file__)
    main_path = os.path.dirname(main_path)
    return os.path.join(os.path.dirname(main_path), "Config")

def signal_handler(sig, frame):
    """
    Signal-Handler für SIGINT (Ctrl+C) und SIGTERM.
    Setzt das globale Event, um alle Coroutinen zum Beenden zu bringen.
    """
    logger.info(f"\nSignal {sig} empfangen. Fahre das Programm herunter...")
    shutdown_event.set()
async def main():
    logger.info("starting Plant Management System")

    # Registrieren der Signal-Handler
    # SIGINT für Ctrl+C
    loop = asyncio.get_running_loop()
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    # SIGTERM für elegante Beendigung unter Linux/Systemd
    if sys.platform != "win32":  # Windows hat kein SIGTERM in der gleichen Weise
        loop.add_signal_handler(signal.SIGTERM, signal_handler, signal.SIGTERM, None)


    # calculate the path to the config directory and log it
    config_path = get_config_path()
    logger.info(f"Config path: {config_path}")

    global plant_manager # to use the global plant_manager variable. Used to call cleanup() on the manager for keyboardinterupt
    plant_manager = PlantManager(os.path.join(config_path, config_plant_file)) # Adresse von der PlantConfig wird gebaut

    connection_config = toml.load_file(os.path.join(config_path, config_connection_file))
    device_client = DeviceClient(connection_config, plant_manager)

    #Corotinene Device Client und Plant Manager starten
    await plant_manager.start(device_client, shutdown_event)

    # Warten, bis das Shutdown-Event gesetzt wird
    await shutdown_event.wait()
    logger.info("Plant Management System is closed")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        #TODO eigentlich sollte der eventloop das beenden + Device_Client verbindung trennen
        print("\nProgramm durch KeyboardInterrupt (Ctrl+C) direkt beendet.")
        if plant_manager:
            plant_manager.cleanup()
