import {Registry} from "azure-iothub";

export interface IoTHubBundle {
    registry: Registry
    updateDesired: (deviceId: string, patch: any) => Promise<void>
}

let iotHubInstance: IoTHubBundle | null = null;

function connectToIoTHub(
    connectionString: string
): IoTHubBundle {
    const registry = Registry.fromConnectionString(connectionString);

    const updateDesired = async (deviceId: string, patch: any) => {
        const { responseBody: twin } = await registry.getTwin(deviceId);
        await twin.update({
            properties: {
                desired: patch
            }
        })
    }

    return { registry, updateDesired }
}

export function getIoTHubBundle(): IoTHubBundle | null {
    if (!iotHubInstance) {
        const connectionString = process.env.IoTHubRegRWConnStr;
        if (!connectionString) {
            throw new Error("IoTHubRegRWConnStr environment variable is not set.");
        }
        iotHubInstance = connectToIoTHub(connectionString);
    }
    return iotHubInstance;
}
