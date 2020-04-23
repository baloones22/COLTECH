import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import path from 'path';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import SentryConfig from './config/sentry';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    // Sentry.init(SentryConfig);

    this.middlewares();
    this.routes();
    // this.exceptionHandler();
  }

  middlewares() {
    // this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
    // this.server.use(Sentry.Handlers.errorHandler());
  }

  /*  exceptionHandler() {
    try {
      // eslint-disable-next-line no-unused-vars
      this.server.use(async (err, req, res, next) => {
        if (process.env.NODE_ENV === 'development') {
          const errors = await new Youch(err, req).toJSON();

          return res.status(500).toJSON(errors);
        }

        return res.status(500).json({ error: 'Internal server error' });
      });
    } catch (error) {
      console.log(error);
    }
  } */
}

export default new App().server;
