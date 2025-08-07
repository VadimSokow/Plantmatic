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
    return os.path.join(os.path.dirname(main_path), "config")


def signal_handler(sig, frame):
    """
    Signal-Handler for SIGINT (Ctrl+C) and SIGTERM/SIGINT.
    Sets the global shutdown event to stop all coroutines.
    """
    logger.info(f"\nSignal {sig} received. Shutting down programm...")
    shutdown_event.set()


async def main():
    logger.info("starting Plant Management System")

    # Register signal handlers
    loop = asyncio.get_running_loop()
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    # Register signal handlers for shutdown on Linux/Systemd
    if sys.platform != "win32":
        loop.add_signal_handler(signal.SIGTERM, signal_handler, signal.SIGTERM, None)
        loop.add_signal_handler(signal.SIGINT, signal_handler, signal.SIGINT, None)# SIGINT = Ctrl+C

    # calculate the path to the config directory
    config_path = get_config_path()
    logger.info(f"Config path: {config_path}")

    # Construct config file path and initialize PlantManager
    plant_manager = PlantManager(os.path.join(config_path, config_plant_file))
    global plant_manager # to use the global plant_manager variable. Used to call cleanup() on the manager for keyboardinterupt
    plant_manager = PlantManager(os.path.join(config_path, config_plant_file)) # Adresse von der PlantConfig wird gebaut

    connection_config = toml.load_file(os.path.join(config_path, config_connection_file))
    device_client = DeviceClient(connection_config, plant_manager)

    #Corotinene Plant Manager starten
    await plant_manager.start(device_client, shutdown_event)

    # Waiting till Shutdown Event is set
    await shutdown_event.wait()
    device_client.disconnect_device_client()
    logger.info("Plant Management System is closed")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:

        print("\nProgram terminated by KeyboardInterrupt (Ctrl+C).")
        if plant_manager:
            plant_manager.cleanup()


