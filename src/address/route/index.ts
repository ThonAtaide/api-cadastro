import express, { Response, Request } from "express";
import asyncWrapper from '../../utils/asyncWrapper/index';
import validateSchema from "../../utils/schemaValidator";
import { validateAuthentication } from "../../utils/validateAuthentication";
import { AddressDao } from "../dao";
import { AddressService } from "../service";
import { addressCreateSchema, addressUpdateSchema } from './schemas/index';
import { Knex } from "knex";
import {InvalidParameterError, MissingParameterError, NotFoundError} from "../../exceptions";
import { extractIdParams } from '../../utils/restResources/index';

const router = express.Router();
const service: AddressService = new AddressService(new AddressDao());

router.post(
    '/',
    validateAuthentication,
    validateSchema(addressCreateSchema),
    asyncWrapper(async (req: Request, res: Response) => {
        const userId = req.user;
        const {
            city,
            city_state,
            neighbor,
            street,
            house_number,
            postal_code
        } = req.body;
        const address = await service.createAddress(
            userId as number,
            {
                city,
                city_state,
                neighbor,
                street,
                house_number,
                postal_code
            },
            req.uow as Knex.Transaction)
        res.status(201).send(address);
    })
);

router.patch(
    '/:id',
    validateAuthentication,
    validateSchema(addressUpdateSchema),
    asyncWrapper(async (req: Request, res: Response) => {

        const addressId = extractIdParams(req, 'Address');
        const {
            id,
            city,
            city_state,
            neighbor,
            street,
            house_number,
            postal_code
        } = req.body;
        const address = await service.updateAddress(
            addressId,
            {
                id,
                city,
                city_state,
                neighbor,
                street,
                house_number,
                postal_code
            },
            req.uow as Knex.Transaction)
        res.status(201).send(address);
    })
);

router.get(
    '/:id',
    validateAuthentication,
    asyncWrapper(async (req: Request, res: Response) => {
        const addressId = extractIdParams(req, 'Address');
        const address = await service.findAddressById(addressId, req.uow as Knex.Transaction);
        res.status(200).send(address);
    })
);

router.get(
    '/',
    validateAuthentication,
    asyncWrapper(async (req: Request, res: Response) => {
        const userId = req.user;
        const address = await service.findAddressByUserId(userId as number, req.uow as Knex.Transaction);
        res.status(200).send(address);
    })
);

router.delete(
    '/:id',
    validateAuthentication,
    asyncWrapper(async (req: Request, res: Response) => {
        const addressId = extractIdParams(req, 'Address');
        await service.deleteAddressById(addressId, req.uow as Knex.Transaction);
        res.status(200).send();
    })
);

export default router;