import { NextFunction, Response, Router } from 'express';

import Swagger from 'swagger-jsdoc';
import * as SwaggerUI from 'swagger-ui-express';

const swaggerOptions: Swagger.Options = {
    definition: {
        openapi: '3.0.0',
        host: `localhost:${process.env.PORT}`,
        basePath: '/',
        info: {
            title: process.env.APP_NAME || 'Steam Sale App API',
            version: process.env.npm_package_version || '1.0.0',
            description: 'Steam Sake App RESTful API',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        'src/API/routes/*.ts', // REST API
        'src/Business/entities/*.ts', // model
        'src/Business/entities/*/*.ts', // model
    ],
};

const swaggerUIOptions: SwaggerUI.SwaggerOptions = {
    customSiteTitle: 'Steam Sale App API',
};

const swaggerSpec = Swagger(swaggerOptions);

export class SwaggerRouter {
    public init(): Router {
        let router: Router = Router();

        router.use('/api-docs', SwaggerUI.serve);
        router.use('/api-docs', this.swaggerHeaders);
        router.get('/api-docs', SwaggerUI.setup(swaggerSpec, swaggerUIOptions));
        router.get('/api-docs.json', this.jsonDoc);

        return router;
    }

    private jsonDoc(_: any, res: Response): Response {
        res.setHeader('Content-Type', 'application/json');
        return res.send(swaggerSpec);
    }

    private swaggerHeaders(_: any, res: Response, next: NextFunction): void {
        res.header('Content-Security-Policy', `default-src http: data: 'unsafe-inline' 'unsafe-eval'`);
        next();
    }
}
