// External Depdendencies
import { Router } from 'express';

// Local Depdendencies
import { GameRouter } from '@API/routes/game';
import { SwaggerRouter } from '@API/routes/swagger';

class BaseRouter {
    static init() {
        const router = Router();
        router.use('/game',  new GameRouter().init());
        router.use('/docs', new SwaggerRouter().init());
        return router;
    }
}

// Export the base-router
export default BaseRouter.init();
