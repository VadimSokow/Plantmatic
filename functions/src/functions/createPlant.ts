import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {CosmosClient} from "@azure/cosmos"
import {handleExtractUserEmail} from "../helper/auth";

const cosmosEndpoint = process.env.CosmosDBEndpoint;
const cosmosKey = process.env.CosmosDBKey;


export async function createPlant(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {


    try {
        const client = new CosmosClient({
            endpoint: cosmosEndpoint,
            key: cosmosKey,
        })
        const dbName = "Plantmatic"
        const plantConName = "plants"
        const database = client.database(dbName)
        const plantContainer = database.container(plantConName)


        const body: any = await request.json()


        const name = body.name
        const latName = body.latName

        let email = handleExtractUserEmail(request)
        if (typeof email !== 'string') {
            return email;
        }

        const userId = email
        const newPlant = {
            userId,
            name,
            latName,
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
