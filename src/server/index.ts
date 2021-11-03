import express, { Express, Request, Response, NextFunction } from 'express';
import { InvalidParameterError, CustomError } from '../exceptions';

import authRouter from '../auth/route';
import userRouter from '../user/route';
import addressRouter from '../address/route';
import asyncWrapper from '../utils/asyncWrapper';
import Authentication from '../auth/service';
import { UserLoggedDto } from '../auth/model';
import { generateTransaction } from '../utils/database';
import knex from '../utils/database';
import { Knex } from 'knex';

export class Server {
    private app: Express;
    private port: String;
    private authService: Authentication;

    constructor(port: string = '5000') {
        this.port = port;
        this.app = express();
        this.authService = new Authentication();
    }

    private setupTransaction(): void {
        this.app.use(generateTransaction());
    }

    private setupRouteModules(): void {
        this.app.use('/auth', authRouter);
        this.app.use('/user', userRouter);
        this.app.use('/user/address', addressRouter);
    }

    private setupBodyParser(): void {
        this.app.use(express.json());
    }

    private setupHealth(): void {
        this.app.get('/', (_req: Request, res: Response) => {
            console.log(_req.user);
            res.send('Up an running...')
        });
    }

    private setupAutorization(): void {

        this.app.use(asyncWrapper(async (req: Request, _res: Response, next: NextFunction) => {
            console.log('Validating Authorization...')
            const authorization: string = req.headers['authorization'] || '';
            const match = /^Bearer: (.*)$/.exec(authorization);
            const trx: Knex.Transaction = await knex.transaction();

            if (match) {
                console.log('Token was found. Validating it...')
                const token = match[1];
                let user: UserLoggedDto;
                try {
                    user = await this.authService.validateToken(token, trx);
                    trx.commit();
                }catch (e) {
                    trx.rollback();
                    throw e;
                }

                req.user = user.id;
            }
            next();
        }));
    }

    private setupErrorHandler(): void {
        this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
            let response;
            console.log(err);
            if (err instanceof CustomError) {
                if (err instanceof InvalidParameterError) {
                    const invalidParameterError: InvalidParameterError = err as InvalidParameterError;
                    response = {
                        statusCode: invalidParameterError.getStatusCode(),
                        reason: invalidParameterError.getReason()
                    };
                } else {
                    const customError: CustomError = err as CustomError;
                    response = {
                        statusCode: customError.getStatusCode(),
                        reason: customError.getReason()
                    };
                }

            } else {
                response = {
                    statusCode: 500,
                    reason: err.message || 'Erro interno'
                };
            }

            res.status(response.statusCode).send(response);
        });
    }

    private setupLogger(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.on('finish', () => {
                console.log(new Date().toISOString(), `[${req.method}]`, req.url, res.statusCode);
            });
            next();
        });
    }

    public startListen(): void {
        this.setupLogger();
        this.setupTransaction();
        this.setupBodyParser();
        this.setupAutorization();
        this.setupRouteModules();
        this.setupHealth();
        this.setupErrorHandler();

        this.app.listen(this.port, () => {
            console.log(`Running on port ${this.port}`)
        })
    }
}