import tomllib
from typing import Any
import tomli_w
from src.logger import create_logger

logger = create_logger(__name__)

def load_file(path: str) -> dict[str, Any]:
    """
    Loads a .toml file and returns it as a dict.
    :param path: Path to the .toml file.
    :return: The content of the .toml file as a dictionary.
    """
    logger.info(f"loading file: {path}")
    with open(path, "rb") as f:
        toml_dict = tomllib.load(f)
        f.close()
    return toml_dict


def delete_section_file(path: str, section: str) -> bool:
    """
    Deletes a section from a .toml file.
    :param path: Path to the .toml file.
    :param section: The section to delete.
    :return: True if the section was deleted successfully, False otherwise.
    """
    logger.info(f"deleting selection: {section} in file: {path}")
    config = load_file(path)
    if section in config:
        del config[section]
    try:
        with open(path, "wb") as f:
            tomli_w.dump(config, f)
        return True
    except Exception as e:
        return False


def update_section_file(path: str, section: str, key: str, value) -> bool:
    """
    Updates a key in a section of a .toml file.
    :param path: Path to the .toml file.
    :param section: The section to update.
    :param key: The key in the section to update.
    :param value: The new value for the key.
    :return: True if the update was successful, False otherwise.
    """
    logger.info(f"updating selection: {section} in file: {path}")
    config = load_file(path)
    # Check if section and key are not None
    if section is None or key is None:
        logger.error("Section and Key can not be None!")
        return False

    if section in config:
        config[section][key] = value
    else:
        config[section] = {key: value}
    try:
        with open(path, "wb") as f:
            tomli_w.dump(config, f)
        return True
    except Exception as e:
        return False
