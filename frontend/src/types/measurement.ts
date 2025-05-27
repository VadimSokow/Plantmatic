interface Measurement {
    id: string;
    deviceId: string;
    plantId?: string;
    timestamp: Date;
    sensorDefinitionId: string;
    fieldName: string;
    sensorType: string;
    value: number;
}
