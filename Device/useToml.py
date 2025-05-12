import tomli
import toml

default_toml_path = "" #TODO der Pfad zur Datei config.toml

def update_toml ( section:str, key:str, new_value, toml_path:default_toml_path):
    '''
    Updates the given KEY in the Given Section of the given .toml file
    Example:
    [Section]
    Key1 = value
    Key2 = value
    '''
    print("updating toml")
    config = load_toml_config(toml_path)

    if section == None or key == None:
        print("Section and Key can not be None!")
        return

    if section in config:
        config[section][key] = new_value
    else:
        config[section] = {key: new_value}
    try:

        with open(default_toml_path, "w") as f:
         toml.dump(config, f)
         print("HIER")
         f.close()
    except Exception as e:
        print("Fehler beim schreiben in toml " + e)


def load_toml_config (toml_path = default_toml_path):
    '''
    Reads the File that is given. Default is the config.toml
    Returns a Pyton dict.
    '''
    print("loading config.toml")
    with open(toml_path, "rb") as f:
        toml_dict = tomli.load(f)
    return toml_dict