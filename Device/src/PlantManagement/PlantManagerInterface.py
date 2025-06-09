import abc
from typing import Any


class PlantManagerInterface(abc.ABC):
    @abc.abstractmethod
    def push_new_plant_config(self, config: dict[str, Any]) -> None:
        pass
