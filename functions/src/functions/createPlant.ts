import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";
import {getCosmosBundle} from "../helper/cosmos";
import {handleExtractUserEmail} from "../helper/auth";



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


        const plantConName = "plants"
        const deviceConName = "devices"
        const deviceContainer = cosmos.db.container(deviceConName)
        const plantContainer = cosmos.db.container(plantConName)


        const body: any = await request.json()

        //für Pflanze
        const name = body.name
        const latName = body.latName

        //für Jeraät

        const deviceId = body.deviceId
        const slotNumber = body.slotNumber

        console.log("Für Geärt: ", deviceId, slotNumber)

        if (!name || !latName || !deviceId || !slotNumber) {
            return {
                status: 400
            }

        }


        const userId = email
        const newPlant = {
            userId,
            name,
            latName,
        }


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
        if (slotIndex < 0) {
            return {
                status: 404,
                body: "Slotnummer mit der übergebenen Nummer nicht gefunden"
            }
        }

        const slotDefinition = ps[slotIndex]
        if (slotDefinition.plantId != null) {
            return {
                status: 409,
                body: "In dem übergebenen Slot befindet sich bereits eine Pflanze"
            }
        }

        slotDefinition.plantId = plantId
        device.plantSlots[slotIndex] = slotDefinition

        const {resource: updatedDevice} = await deviceContainer.item(device.id, device.id).replace(device)

        console.log("Device aktualisiert: ", updatedDevice)

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
