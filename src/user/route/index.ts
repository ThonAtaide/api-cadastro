import express, { Request, Response, Router } from 'express';
import asyncWrapper from '../../utils/asyncWrapper';
import validateSchema from '../../utils/schemaValidator/index';
import { CreateUserDto, UserDto } from '../model';
import { UserService } from '../service';
import { userRegisterSchema } from './schemas/index';
import { UserAuthDao } from '../../auth/dao/index'
import { Knex } from 'knex';
import { UserProfileDao } from '../dao';

const route: Router = express.Router();
let service: UserService;

const injectDependencies = () => {
    const userAuthDao: UserAuthDao = new UserAuthDao();
    const userProfileDao: UserProfileDao = new UserProfileDao();
    service = new UserService(userAuthDao, userProfileDao);
}

injectDependencies();

route.post(
    '/',
    validateSchema(userRegisterSchema),
    asyncWrapper(async (req: Request, res: Response) => {
        const {
            username, password, name, gender, birth_day
        }: {
            username: string,
            password: string,
            name: string,
            gender: string,

            birth_day: string
        } = req.body;

        const userRequest: CreateUserDto = {
            username, password, name, gender, birth_day
        };

        const userDto = await service.createUser(userRequest, req.uow as Knex.Transaction);

        res.status(200).send(userDto);
    }));

export default route;

