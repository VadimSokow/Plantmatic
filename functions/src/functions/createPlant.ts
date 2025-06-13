import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {CosmosClient} from "@azure/cosmos"

const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;


export async function createPlant(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {


    /*
    const header = request.headers.get("authorization")
    const email = getUser(header)
    console.log("E-mail: ", email)

    if (!email) {
        return {
            status: 401,
        }
    }

     */


    try {
        const client = new CosmosClient({
            endpoint: cosmosEndpoint,
            key: cosmosKey,
        })
        const dbName = "Plantmatic"
        const plantConName = "plants"
        const plantTypeConName = "plantType"
        const database = client.database(dbName)
        const plantContainer = database.container(plantConName)


        const body: any = await request.json()


        const deviceId = body.deviceId
        const name = body.name
        const latname = body.latName

        /*
        if (!userId || !deviceId || !name || !latname) {
            return {
                status: 400
            }

        }

         */

        const newPlant = {
            //userId,
            deviceId,
            name,
            latname,
            currentSensorData: {} //"serversetig" setzen damit es auf jeden Fall da ist
        }

        const {resource} = await plantContainer.items.create(newPlant)

        console.log(resource)

        return {
            status: 200
        }


    } catch (error) {
        context.log("Fehler beim Zugriff auf DB: ", error)
        return {
            status: 500
        }
    }

};

app.http('createPlant', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'plants',
    handler: createPlant
});
