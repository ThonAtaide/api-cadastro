import express, { Request, Response, NextFunction } from 'express';
import config from '../../config/index';
import knexLib, { Knex } from 'knex';

const settings = config();

const knex = knexLib({
    client: 'pg',
    connection: settings.DATABASE_URL,
    debug: true
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

export function isViolacaoChaveEstrangeira(err: any) {
    return err.code === '23503'; // https://www.postgresql.org/docs/8.2/errcodes-appendix.html
}
