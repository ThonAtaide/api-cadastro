import express from "express"
import { Knex } from 'knex';

declare global {
    namespace Express {
        interface Request {
            uow?: Record<string, any>
        }
    }
}