import board
import adafruit_ads1x15.ads1115 as ADS
# TODO kann weg

'''
Gerät Modell v1 Spezifikation 
Globale Sensoren: 
- 1 DHT11 (Temp, Humidity)
- 1 Lichtsensor
Slot Sensoren: 
- max 3 Pumpen
- max 3x3 LEDs (je Slot 3 Leds: Rot, Grün, Gelb)
- max 3 Soil Moisture Sensor
'''
# --- Pin Konfiguration (BCM Nummerierung) ---
DHT11_PIN = board.D4
LIGHT_SENSOR_ADC_CHANNEL = ADS.P2  # A2 todo checken, ob wirklich an Chanel 2 oder doch chanel 1
SOIL_MOISTURE_ADC_CHANNEL_SLOT0 = ADS.P0  # A0
SOIL_MOISTURE_ADC_CHANNEL_SLOT1 = ADS.P1  # A1
SOIL_MOISTURE_ADC_CHANNEL_SLOT2 = ADS.P3  # A1

# --- Pins für Aktoren ---
# Pins für Pumpen (SLOT 0, 1, 2)
RELAY_PIN_PUMP_SLOT0 = board.D17
RELAY_PIN_PUMP_SLOT1 = board.D10
RELAY_PIN_PUMP_SLOT2 = board.D9
# Pins für LEDs SLOT 0
LED_PIN_RED_SLOT0 = board.D27
LED_PIN_YELLOW_SLOT0 = board.D22
LED_PIN_GREEN_SLOT0 = board.D5
# Pins für LEDs SLOT 1
LED_PIN_RED_SLOT1 = board.D11
LED_PIN_YELLOW_SLOT1 = board.D6
LED_PIN_GREEN_SLOT1 = board.D26
# Pins für LEDs SLOT 2
LED_PIN_RED_SLOT2 = board.D23
LED_PIN_YELLOW_SLOT2 = board.D24
LED_PIN_GREEN_SLOT2 = board.D25

# --- Logik-Schwellwerte ---
# Spannungen Bodenfeuchte Min / Max
SOIL_MOISTURE_VOLTAGE_DRY: float = 2.21     #Spannung an der Luft
SOIL_MOISTURE_VOLTAGE_WET: float = 0.935    #Spannung im Wasser

# --- Spannungen Lichtsensor Min / Max ---
LIGHT_SENSOR_VOLTAGE_DARK: float = 3.3      #Absolut dunkel
LIGHT_SENSOR_VOLTAGE_BRIGHT: float = 0.2    #Absolut hell

# --- Zeit-Einstellungen ---
SENSOR_READ_INTERVAL_SECONDS: int = 10      # Wie oft Sensoren lesen
PUMP_ON_DURATION_SECONDS: float = 3.0       # Wie lange pumpen
PUMP_COOLDOWN_SECONDS: int = 60 * 10        # Mindestpause zwischen Pumpvorgängen (10 Min)

# Bodenfeuchte (Beispielwerte in %) todo aus cloud config laden und in die toml umziehen
SOIL_MOISTURE_THRESHOLD_LOW = 30.0
SOIL_MOISTURE_THRESHOLD_OK_LOW = 45.0
SOIL_MOISTURE_THRESHOLD_OK_HIGH = 70.0



