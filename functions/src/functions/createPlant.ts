import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {getCosmosBundle} from "../helper/cosmos";
import {handleExtractUserEmail} from "../helper/auth";
import {getIoTHubBundle} from "../helper/iothub";



export async function createPlant(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let email = handleExtractUserEmail(request)
    if (typeof email !== 'string') {
        return email;
    }

    try {
        const cosmos = getCosmosBundle()

        if (!cosmos) {
            return {status: 500, body: "Database not available"}
        }

        const hub = getIoTHubBundle()
        if (!hub) {
            return {status: 500, body: "IoT Hub not available"}
        }

        // some cosmos prepare
        const plantConName = "plants"
        const deviceConName = "devices"
        const deviceContainer = cosmos.db.container(deviceConName)
        const plantContainer = cosmos.db.container(plantConName)

        // collect body
        const body: any = await request.json()

        //für Pflanze
        const name = body.name
        const latName = body.latName

        // extract device data
        const deviceId = body.deviceId
        const slotNumber = body.slotNumber

        console.log("Daten fuer Device: ", deviceId, slotNumber)

        // check if all device data is present
        if (!name || !latName || !deviceId || !slotNumber) {
            return {
                status: 400
            }
        }

        // check if the slot in the device is empty
        const deviceQuery = {
            query: "SELECT * FROM c WHERE c.id = @id",
            parameters: [
                {name: '@id', value: deviceId}
            ]
        }

        const deviceResponse = await deviceContainer.items.query(deviceQuery).fetchAll()
        const devices = deviceResponse.resources as Array<Record<string, any>>
        if (!devices || devices.length === 0) {
            return {
                status: 404,
                body: "Gerät konnte nicht in der DB gefunden werden"
            }
        }
        const device = devices[0]

        // get the right slot definition of the device
        console.log("Gerät: ", device)
        const ps = device.plantSlots as Array<{ plantId: string | null, slotNumber: number }> | undefined
        console.log("Slots: ", ps)
        if (!ps) {
            return {
                status: 404,
                body: "PlantsSlots vom Gerät nicht gefunden"
            }
        }
        const slotIndex = ps.findIndex(slot => slot.slotNumber == slotNumber)
        console.log(`slot ${slotNumber} has ${slotIndex} as index`)
        if (slotIndex < 0) {
            return {
                status: 404,
                body: "Slotnummer mit der übergebenen Nummer nicht gefunden"
            }
        }
        const slotDefinition = ps[slotIndex]
        console.log("slotDefinition: ", slotDefinition)
        // check if a plant is already present, when yes -> error
        if (slotDefinition.plantId != null) {
            return {
                status: 409,
                body: "In dem übergebenen Slot befindet sich bereits eine Pflanze"
            }
        }

        // build a new plant Entry
        const userId = email
        const newPlant = {
            userId,
            name,
            latName,
        }

        // insert the plant into the DB
        const {resource} = await plantContainer.items.create(newPlant)
        if (!resource){
            return {
                status: 500,
                body: "Datenbank hat Pflanze nicht erstellt"
            }
        }
        console.log(resource)
        const plantId = resource.id
        console.log("ID der Pflanze: ", resource.id)

        // update the plantId and update the DB entry of the device
        slotDefinition.plantId = plantId
        device.plantSlots[slotIndex] = slotDefinition
        console.log("new Device def: ", device)
        const {resource: updatedDevice} = await deviceContainer.item(device.id, device.id).replace(device)
        console.log("Device aktualisiert: ", updatedDevice)

        // read the plant type by latName
        const plantTypeQuery = {
            query: "SELECT * FROM c WHERE c.latName = @latName",
            parameters: [{name: '@latName', value: latName}]
        }
        const { resources: plantTypes } = await cosmos.query("plantType", plantTypeQuery).fetchAll()
        if (!plantTypes || plantTypes.length === 0) {
            return {
                status: 404,
                body: "Pflanzenart nicht gefunden"
            }
        }
        const plantType = plantTypes[0]
        console.log("Pflanzenart: ", plantType)

        // create plant entry for iot hub device twin
        const plantConfig = { slot_num: slotNumber - 1 };
        plantType.configFields.forEach((field) => {
            plantConfig[field.fieldName] = field.defaultValue;
        })
        const twinEntry = {
            [plantId]: plantConfig
        }

        // now update the device twin
        await hub.updateDesired(deviceId, twinEntry)

        return {
            status: 201,
            body: JSON.stringify(resource)
        }
    } catch (error) {
        context.log("Fehler beim Zugriff auf DB: ", error)
        return {
            status: 500
        }
    }

}

app.http('createPlant', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'plants',
    handler: createPlant
});
