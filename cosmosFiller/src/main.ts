import {cosmosHelper, replaceAllDataAt} from "./cosmos";
import {devices} from "./data/device";
import {plants} from "./data/plants";
import {deviceModels} from "./data/deviceModel";
import {plantTypes} from "./data/plantTypes";

interface Measurement {
    deviceId: string
    plantId: string
    timestamp: number
    fieldName: string
    value: number
}

async function main() {
    const COSMOS_DB_CONNECTION_STRING = "AccountEndpoint=URL;AccountKey=KEY;";
    const DATABASE_NAME = "Plantmatic";

    await replaceAllDataAt(COSMOS_DB_CONNECTION_STRING, DATABASE_NAME, "models", ['id'], deviceModels);
    console.log("models replaced");
    await replaceAllDataAt(COSMOS_DB_CONNECTION_STRING, DATABASE_NAME, "devices", ['id'], devices);
    console.log("devices replaced");
    await replaceAllDataAt(COSMOS_DB_CONNECTION_STRING, DATABASE_NAME, "plantType", ['latname'], plantTypes);
    console.log("plantTypes replaced");
    await replaceAllDataAt(COSMOS_DB_CONNECTION_STRING, DATABASE_NAME, "plants", ['id'], plants);
    console.log("plants replaced");

    const start = new Date('2025-06-07T00:00:00Z');
    const end = new Date('2025-06-09T23:59:59Z');

    const cosmos = cosmosHelper(
        COSMOS_DB_CONNECTION_STRING,
        DATABASE_NAME,
        "measurements"
    );

    let counter = 0;
    while (await cosmos.deleteAllItems(['plantId', 'fieldName'], counter++)) {
        console.log(`Deleted page ${counter} of items`);
    }
    // führe Device und Plant zusammen
    for (const device of devices) {
        const plant = plants.find(p => {
            return device.plantSlots.some(slot => slot.plantId === p.id);
        })
        if (!plant) continue;
        const model = deviceModels.find(m => m.id === device.modelId);
        if (!model) continue;
        for (const slot of device.plantSlots) {
            const plantId = slot.plantId;
            const sensors = Object.values(model.sensors).filter(sensor => sensor.slot === slot.slotNumber);
            if (!sensors) continue;

            for (const sensor of sensors) {
                const fieldName = sensor.fieldName;
                const deviceId = device.id;

                await placeRandomDataAtDB(
                    deviceId,
                    plantId,
                    fieldName,
                    start,
                    end,
                    5,
                    sensor.min,
                    sensor.max,
                    async (data) => {
                        console.log(`Inserting data for device ${deviceId}, plant ${plantId}, field ${fieldName}`);
                        const chunkSize = 100;
                        const chunks: object[][] = [];
                        for (let i = 0; i < data.length; i += chunkSize) {
                            chunks.push(data.slice(i, i + chunkSize));
                        }
                        for (const chunk of chunks) {
                            await cosmos.insert(chunk)
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                );
            }
        }
    }
}

async function placeRandomDataAtDB(
    deviceId: string,
    plantId: string,
    fieldName: string,
    startTimestamp: Date,
    endTimestamp: Date,
    intervalMinutes: number,
    minValue: number,
    maxValue: number,
    inserter: (data: object[]) => Promise<void>,
) {
    const count = Math.ceil((endTimestamp.getTime() - startTimestamp.getTime()) / (intervalMinutes * 60 * 1000));
    const data = dataGenerator(
        deviceId,
        plantId,
        fieldName,
        count,
        startTimestamp,
        endTimestamp,
        minValue,
        maxValue
    );
    await inserter(data);
}


function dataGenerator(
    device: string,
    plant: string,
    field: string,
    count: number,
    startTimestamp: Date,
    endTimestamp: Date,
    minValue: number,
    maxValue: number
): Measurement[] {
    const startTime = startTimestamp.getTime();
    const endTime = endTimestamp.getTime();
    const timeStep = (endTime - startTime) / count;
    let currentTime = startTime;

    const calculateRandomTimestamp = (): number => {
        // Generiere einen zufälligen Zeitstempel innerhalb des Zeitraums
        // const randomOffset = Math.floor(Math.random() * timeStep);
        currentTime += timeStep;
        return currentTime;
    }

    const values: {value: number, timestamp: number}[] = [];
    // generiere Werte für das Feld
    // diese sind zufällig, aber zusammenhängend, also dürfen sie nicht zu weit auseinander liegen
    for (let i = 0; i < count; i++) {
        const timestamp = calculateRandomTimestamp();
        const value = Math.random() * (maxValue - minValue) + minValue;
        values.push({value, timestamp});
    }

    return values.map(({value, timestamp}) => ({
        deviceId: device,
        plantId: plant,
        fieldName: field,
        timestamp: timestamp,
        value: value,
    }));
}


main().then(r => console.log(r)).catch(e => console.error(e));
