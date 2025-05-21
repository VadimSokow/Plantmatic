import tomllib
import tomli_w



def update_toml ( section:str, key:str, new_value, toml_path:str) -> bool:
    '''
    Updates the given KEY in the Given Section of the given .toml file
    Returns True when update was successful and false if not
    Example:
    [Section]
    Key1 = value
    Key2 = value
    '''
    print("<update_toml>")
    #https://pypi.org/project/tomli-w/#write-to-file
    #pip install tomli-w
    config = load_toml_config(toml_path)

    if section == None or key == None:
        print("Section and Key can not be None!")
        return False #TODO Prüfen ob das sinn mach, dass key wirklich nicht none sein darf!!!!!!

    if section in config:
        config[section][key] = new_value
    else:
        config[section] = {key: new_value}
    try:
        with open(toml_path, "wb") as f:
         tomli_w.dump(config, f)
         print("</update_toml>")
        return True
    except Exception as e:
        print(f"Fehler beim schreiben in toml  {e}")
        print("</update_toml>")
        return False
        


def load_toml_config (toml_path):
    '''
    Reads the File that is given. Default is the toml file
    Returns a Pyton dict.
    '''
    print("<load_toml_config>")
    with open(toml_path, "rb") as f:
        toml_dict = tomllib.load(f)
        f.close()
    print("</load_toml_config>")
    return toml_dict


