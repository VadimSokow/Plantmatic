import { app } from '@azure/functions';
import { getCosmosBundle } from './helper/cosmos';

app.setup({
    enableHttpStream: true,
});

// init connection to cosmos
const cosmosBundle = getCosmosBundle();
if (!cosmosBundle) {
    throw new Error("Failed to connect to CosmosDB. Check environment variables.");
}
