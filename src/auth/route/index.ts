import express, { Request, Response, Router } from 'express';
import { Knex } from 'knex';
import asyncWrapper from '../../utils/asyncWrapper';
import { JwtToken } from '../../utils/jwtToken';
import validateSchema from '../../utils/schemaValidator';
import { UserLoginRequestDto } from '../model';
import Authentication from '../service';

import { loginSchema } from './schemas';
const route: Router = express.Router();
const authenticationService: Authentication = new Authentication();

route.post(
    '/',
    validateSchema(loginSchema),
    asyncWrapper(
        async (req: Request, res: Response) => {
            const { username, password }: { username: string, password: string } = req.body;
            const credentials: UserLoginRequestDto = { username, password };
            const token: JwtToken = await authenticationService.authenticate(credentials, req.uow as Knex.Transaction);
            res.status(200).send(token);
        }));

export default route;