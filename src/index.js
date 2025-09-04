import { setupServer } from "./server.js";
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExsist } from "./utils/createDirIfNotExists.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constans/index.js";

const callSetupServer = async () => {
  await initMongoConnection();
  await createDirIfNotExsist(TEMP_UPLOAD_DIR);
  await createDirIfNotExsist(UPLOAD_DIR);
setupServer();
};

callSetupServer();
