import express, { Request, Response, Router } from 'express';
import asyncWrapper from '../../utils/asyncWrapper';
import validateSchema from '../../utils/schemaValidator/index';
import { CreateUserDto, UserDto } from '../model';
import { UserService } from '../service';
import { userRegisterSchema, userUpdateSchema } from './schemas/index';
import { UserAuthDao } from '../../auth/dao/index'
import { Knex } from 'knex';
import { UserProfileDao } from '../dao';
import { validateAuthentication } from '../../utils/validateAuthentication/index';
import { AddressDao } from '../../address/dao';

const route: Router = express.Router();
let service: UserService;

const injectDependencies = () => {
    const userAuthDao: UserAuthDao = new UserAuthDao();
    const userProfileDao: UserProfileDao = new UserProfileDao();
    const addressDao: AddressDao = new AddressDao();
    service = new UserService(userAuthDao, userProfileDao, addressDao);
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

        const userDto: UserDto = await service.createUser(userRequest, req.uow as Knex.Transaction);

        res.status(201).send(userDto);
    }));

route.get(
    '/',
    validateAuthentication,
    asyncWrapper(async (req: Request, res: Response) => {
        const userId = req.user;
        const user: UserDto = await service.getUser(userId as number, req.uow as Knex.Transaction);
        res.status(200).send(user);
    })
);

route.patch(
    '/',
    validateAuthentication,
    validateSchema(userUpdateSchema),
    asyncWrapper(async (req: Request, res: Response) => {
        const userId = req.user;
        const { id, name, gender, birth_day } = req.body;
        const user: UserDto = await service.updateUser(
            userId as number,
            {
                id,
                name,
                gender,
                birth_day
            },
            req.uow as Knex.Transaction);
        res.status(200).send(user);
    })
);

route.put(
    '/',
    validateAuthentication,
    asyncWrapper(async (req: Request, res: Response) => {
        const userId = req.user;
        await service.deleteUser(userId as number, req.uow as Knex.Transaction);
        res.status(200).send();
    })
);

export default route;

