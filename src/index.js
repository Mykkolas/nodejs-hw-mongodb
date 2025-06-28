import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";
import { createDirIfNotExist } from "./utils/createDirIfNotExists.js";
import { TEMPLATES_DIR } from './constants/index.js';

const bootstrap = async () => {
    await initMongoConnection();
    await createDirIfNotExist(TEMPLATES_DIR);
    setupServer();
};

bootstrap();