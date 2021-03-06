import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import pg from 'pg';
import Knex from 'knex';
import { Model } from 'objection';
import helmet from 'helmet';

import express, { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import 'express-async-errors';
import { HttpError } from '@Core/shared/httpError';

import BaseRouter from '@API/routes';
import logger from '@Core/shared/Logger';
import Passport from '@API/config/passport';

class App {
  public app: express.Application = express();
  private sqlUrl: string =  String(process.env.SQL_URL);

  public constructor() {
      this.expressInit();
      this.setUpDatabase();
  }
 
  private expressInit(): void {
    // app level middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.expressEnvironemntInit();
    Passport.setUp();
    // routes
    this.initializeRouter();
    // error handler middleware
    this.setUpErrorHandler();
  }

  private expressEnvironemntInit(): void {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
      this.app.use(helmet());
    }
  }

  private initializeRouter() {
    this.app.use('/', BaseRouter);
  }

  private setUpErrorHandler(): void {
    this.app.use(
      (err: HttpError, _: Request, res: Response,) => {
        const status = err.status || INTERNAL_SERVER_ERROR;
        const message = err.message || 'Something went wrong';
        logger.error(err.message, err);
        return res.status(status).json({
          error: message
        });
        
      }
    );
  }

  private setUpDatabase() {
    pg.defaults.ssl = true;

    let knexConnection = Knex({
        client: 'pg',
        connection: this.sqlUrl,
        pool: { min: 0, max: 10 },
    });
    Model.knex(knexConnection);
    logger.info('Main database connected');
  }

}

export default new App().app;