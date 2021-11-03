import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import knexLib, { Knex } from 'knex';

const settings = config();

const knex = knexLib({
    client: 'pg',
    connection: settings.DATABASE_URL,
    debug: false,
    pool: {
        min: 2,
        max: 10,
        createTimeoutMillis: 4000,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 10000,
        createRetryIntervalMillis: 100
    },
});

export default knex;

export function generateTransaction() {
    return function (req: Request, res: Response, next: NextFunction) {

        knex.transaction(function (trx: Knex.Transaction) {
            res.on('finish', function () {
                if (res.statusCode < 200 || res.statusCode > 299) {
                    trx.rollback();
                } else {
                    trx.commit();
                }
            });

            req.uow = trx;
            next();
        });
    }
}