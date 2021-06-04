import 'module-alias/register';
import EnvironmentLoader from './LoadEnv';
EnvironmentLoader.loadEnvironmentFile();
import app from '@App';
import logger from '@Core/shared/Logger';

// Start the server 
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
 