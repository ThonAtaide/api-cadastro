import express, {Response, Request} from "express";
import asyncWrapper from '../../utils/asyncWrapper';
import validateSchema from "../../utils/schemaValidator";
import {validateAuthentication} from "../../utils/validateAuthentication";
import {AddressDao} from "../dao";
import {AddressService} from "../service";
import {addressCreateSchema, addressUpdateSchema} from './schemas';
import {Knex} from "knex";
import {extractIdParams} from '../../utils/restResources';

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
        const {
            postal_code,
            city_state,
            city,
            neighbor,
            street,
            house_number,
        } = req.query;

        const userId = req.user;
        const address = await service.findAddressByUserId(
            userId as number,
            {
                postal_code: postal_code as string,
                city_state: city_state as string,
                city: city as string,
                neighbor: neighbor as string,
                street: street as string,
                house_number: house_number as string
            },
            req.uow as Knex.Transaction
        );
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