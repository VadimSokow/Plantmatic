import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * Handler function for the /device/{id} route.
 * Responds to GET requests and returns the device ID from the path.
 * @param request The incoming HTTP request object.
 * @param context The invocation context for the function execution.
 * @returns A promise resolving to the HTTP response initialization object.
 */
export async function getDeviceById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`HTTP trigger function (getDeviceById) processed request for url "${request.url}"`);

    // Zugriff auf den Route-Parameter 'id'.
    // In diesem neuen Modell sind Route-Parameter über request.params.PARAMETERNAME verfügbar.
    const deviceId = request.params.id;

    // Da die Route als "device/{id}" definiert ist, sollte die 'id' immer vorhanden sein,
    // wenn diese Funktion aufgerufen wird. Eine explizite Prüfung ist dennoch gute Praxis.
    if (!deviceId) {
        context.log("Error: Device ID not found in route parameters.");
        // Rückgabe eines Fehlers, obwohl die Route dies verhindern sollte
        return {
            status: 400, // Bad Request
            jsonBody: {
                error: "Device ID not found in route parameters."
            }
        };
    }

    // Erstelle das JSON-Antwortobjekt
    const responseBody = {
        deviceId: deviceId
    };

    context.log(`Returning device ID: ${deviceId}`);

    // Rückgabe des Antwortobjekts
    return {
        status: 200, // HTTP status code 200 OK
        //jsonBody wird verwendet, um ein JavaScript-Objekt als JSON im Body zurückzugeben.
        //Azure Functions setzt den Content-Type automatisch auf application/json.
        jsonBody: responseBody
    };
}

// Registrieren der HTTP-Trigger-Funktion mit dem app-Objekt
app.http('deviceById', { // 'deviceById' ist der interne Name der Function
    methods: ['GET'], // Reagiert nur auf GET-Anfragen
    authLevel: 'anonymous', // Authentifizierungsstufe (anonym, function, admin)
    route: 'device/{id}', // **Definiert die Route hier im Code**
    handler: getDeviceById // Verknüpft die Route mit der Handler-Funktion
});
