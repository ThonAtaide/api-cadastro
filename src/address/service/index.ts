import { Knex } from "knex";
import { MissingParameterError, NotFoundError } from "../../exceptions";
import { AddressDao } from "../dao";
import {AddressDto, AddressFieldsValidator} from "../model";

export class AddressService {
    private addressRepository: AddressDao;

    constructor(addressRepository: AddressDao) {
        this.addressRepository = addressRepository;
    }

    public async createAddress(
        userId: number,
        address: AddressDto,
        trx: Knex.Transaction): Promise<AddressDto> {

        if (!userId) {
            throw new MissingParameterError('User identifier is missing.');
        }

        AddressFieldsValidator.validateCity(address.city);
        AddressFieldsValidator.validateCityState(address.city_state);
        AddressFieldsValidator.validateNeighbor(address.neighbor);
        AddressFieldsValidator.validateStreet(address.street);
        AddressFieldsValidator.validateHouseNumber(address.house_number);
        AddressFieldsValidator.validatePostalCode(address.postal_code);

        return await this.addressRepository
            .createAddress({ ...address, user_profile_id: userId }, trx);
    }

    public async updateAddress(
        addressId: number,
        address: AddressDto,
        trx: Knex.Transaction): Promise<AddressDto> {

        if (!addressId) {
            throw new MissingParameterError('Address identifier is missing.');
        }

        AddressFieldsValidator.validateCity(address.city);
        AddressFieldsValidator.validateCityState(address.city_state);
        AddressFieldsValidator.validateNeighbor(address.neighbor);
        AddressFieldsValidator.validateStreet(address.street);
        AddressFieldsValidator.validateHouseNumber(address.house_number);
        AddressFieldsValidator.validatePostalCode(address.postal_code);

        const addressUpdated = await this.addressRepository
            .updateAddress(addressId, { ...address }, trx);

        return {...addressUpdated, user_profile_id: undefined};
    }

    public async findAddressById(id: number, trx: Knex.Transaction): Promise<AddressDto> {

        if (!id) {
            throw new MissingParameterError(`Address ${id} identifier is missing.`);
        }

        const address = await this.addressRepository.findAddressById(id, trx);

        if (!address) {
            throw new NotFoundError(`Address ${id} not found.`);
        }

        return {...address, user_profile_id: undefined};
    }

    public async findAddressByUserId(userId: number, trx: Knex.Transaction): Promise<Array<AddressDto>> {

        if (!userId) {
            throw new MissingParameterError(`User identifier is missing.`);
        }

        const searchResult = await this.addressRepository.findAddressByUser(userId, trx);
        return searchResult.map(item => {
            return {...item, user_profile_id: undefined}
        })
    }

    public async deleteAddressById(id: number, trx: Knex.Transaction): Promise<void> {

        if (!id) {
            throw new MissingParameterError(`Address ${id} identifier is missing.`);
        }

        const address = await this.addressRepository.findAddressById(id, trx);

        if (!address) {
            throw new NotFoundError(`Address ${id} not found.`);
        }

        await this.addressRepository.deleteAddressById(id, trx);
    }
}