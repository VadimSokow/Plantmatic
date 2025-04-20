import time
import board
import adafruit_dht

DHT_SENSOR_PIN = board.D4 #  BCM PIN 4

try:
    dhtDevice = adafruit_dht.DHT11(DHT_SENSOR_PIN, use_pulseio=False)
    print(f"DHT11 Sensor an GPIO {DHT_SENSOR_PIN.id} initialisiert.")
except RuntimeError as error:
     # Fehler bei der Initialisierung
    print(f"Fehler bei der Initialisierung des DHT11: {error.args[0]}")
    print("Stelle sicher, dass der Pin korrekt ist und die Bibliothek installiert ist.")
    print("Versuche ggf. das Skript mit 'sudo python ...' auszuführen, falls es Rechteprobleme gibt.")
    exit()
except NotImplementedError:
    print("Fehler: Platform-spezifische digitale I/O nicht gefunden. Stelle sicher, dass 'board' und 'digitalio' korrekt für den Pi konfiguriert sind (passiert oft automatisch mit adafruit-blinka).")
    exit()
except Exception as e:
    print(f"Unerwarteter Fehler bei Initialisierung: {e}")
    exit()


print("Lese Sensorwerte (Drücke STRG+C zum Beenden)")
print("-" * 40)

try:
    while True:
        try:
            #Temperatur und Luftfeuchtigkeit lesen
            temperature_c = dhtDevice.temperature
            humidity = dhtDevice.humidity
            # Prüfen der gelesenen Werte (manchmal none)
            if humidity is not None and temperature_c is not None:
                print(f"Temperatur:      {temperature_c:.2f} °C")
                print(f"Luftfeuchtigkeit: {humidity:.2f} %")
                print("-" * 40)
            else:
                print("Fehler: Ungültige Sensorwerte (None) empfangen. Sensor wird erneut abgefragt...")
                print("-" * 40)
                time.sleep(1.0)


        except RuntimeError as error:
            time.sleep(2.0)
            continue
        except Exception as e:
            print(f"Ein unerwarteter Fehler ist aufgetreten: {e}")
            dhtDevice.exit()
            raise e

        time.sleep(2.0)

except KeyboardInterrupt:
    # Benutzer hat STRG+C gedrückt
    print("\nProgramm durch Benutzer beendet.")
finally:
    # Gibt beim Beenden die vom Sensor genutzten Ressourcen frei
    if 'dhtDevice' in locals() and dhtDevice:
         dhtDevice.exit()
    print("Sensor-Ressourcen freigegeben.")