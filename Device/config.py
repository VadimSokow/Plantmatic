import board
import adafruit_ads1x15.ads1115 as ADS

# todo beim Start config aus cloud laden / bei config änderung sendet cloud config Daten
# --- Pin Konfiguration (BCM Nummerierung) ---
DHT11_PIN = board.D4
SOIL_MOISTURE_ADC_CHANNEL = ADS.P0  # A0
#todo weitere Sensoren Konfigurieren
# LIGHT_SENSOR_ADC_CHANNEL = 1  # A1

# Pins für Aktoren
RELAY_PIN_PUMP = board.D17
LED_PIN_RED = board.D27
LED_PIN_YELLOW = board.D22
LED_PIN_GREEN = board.D5

# --- Spannungen Bodenfeuchte Min / Max ---
SOIL_MOISTURE_VOLTAGE_DRY: float = 2.21     #Spannung an der Luft
SOIL_MOISTURE_VOLTAGE_WET: float = 0.935    #Spannung im Wasser

# --- Logik-Schwellwerte ---
# Bodenfeuchte (Beispielwerte in %) todo aus cloud config laden
SOIL_MOISTURE_THRESHOLD_LOW = 30.0
SOIL_MOISTURE_THRESHOLD_OK_LOW = 45.0
SOIL_MOISTURE_THRESHOLD_OK_HIGH = 70.0

# --- Zeit-Einstellungen ---
SENSOR_READ_INTERVAL_SECONDS: int = 10       # Wie oft Sensoren lesen
PUMP_ON_DURATION_SECONDS: float = 3.0        # Wie lange pumpen
PUMP_COOLDOWN_SECONDS: int = 60 * 10     # Mindestpause zwischen Pumpvorgängen (10 Min)

# --- Betriebsmodus ---
USE_MOCK_HARDWARE: bool = False