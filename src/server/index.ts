import express, { Express, Request, Response, NextFunction } from 'express';
import { InvalidParameterError, CustomError } from '../exceptions/index';

import authRouter from '../auth/route/index';
import userRouter from '../user/route/index';
import asyncWrapper from '../utils/asyncWrapper';
import Authentication from '../auth/service/index';
import { UserLoggedDto } from '../auth/model';
import { generateTransaction } from '../utils/database';
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

            const authorization: string = req.headers['authorization'] || '';
            const match = /^Bearer: (.*)$/.exec(authorization);

            if (match) {
                console.log('djskds')
                const token = match[1];
                const x = {}
                const user: UserLoggedDto = await this.authService.validateToken(token, x as Knex.Transaction);
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

    public startListen(): void {
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