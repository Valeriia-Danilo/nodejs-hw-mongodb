import { setupServer } from "./server.js";
import { initMongoConnection } from './db/initMongoConnection.js';

const callSetupServer = async () => {
    await initMongoConnection();
    setupServer();
};

callSetupServer();
