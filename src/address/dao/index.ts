import { Knex } from 'knex';
import { EntityNotCreatedError, EntityNotUpdatedError } from '../../exceptions';
import {AddressDto, AddressQuery} from '../model';

export class AddressDao {

    public async createAddress(address: AddressDto, trx: Knex.Transaction): Promise<AddressDto> {
        const resultSet = await trx('user_address')
            .insert({
                user_profile_id: address.user_profile_id,
                city_state: address.city_state,
                city: address.city,
                neighbor: address.neighbor,
                street: address.street,
                house_number: address.house_number,
                postal_code: address.postal_code
            }).returning('*');

        if (resultSet.length === 0) {
            console.log('Created address: ', address);
            throw new EntityNotCreatedError('Address not creaded.');
        }

        return {
            id: resultSet[0].id,
            user_profile_id: resultSet[0].user_profile_id,
            city_state: resultSet[0].city_state,
            city: resultSet[0].city,
            neighbor: resultSet[0].neighbor,
            street: resultSet[0].street,
            house_number: resultSet[0].house_number,
            postal_code: resultSet[0].postal_code
        };
    }

    public async findAddressById(id: number, userId: number, trx: Knex.Transaction): Promise<AddressDto | null> {
        const resultSet = await trx('user_address')
            .select('*')
            .where('id', id)
            .where('user_profile_id', userId);

        if (resultSet.length === 0) {
            console.log(`Address ${id} not found.`);
            return null;
        }

        return {
            id: resultSet[0].id,
            user_profile_id: resultSet[0].user_profile_id,
            city_state: resultSet[0].city_state,
            city: resultSet[0].city,
            neighbor: resultSet[0].neighbor,
            street: resultSet[0].street,
            house_number: resultSet[0].house_number,
            postal_code: resultSet[0].postal_code
        };
    }

    public async findAddressByUser(userId: number, queryParams: AddressQuery, trx: Knex.Transaction): Promise<Array<AddressDto>> {

         let query = trx('user_address')
            .select('*')
            .where('user_profile_id', userId);

         if (queryParams.postal_code) {
             query = query.where('postal_code', 'ilike', `${queryParams.postal_code}%`);
         }

        if (queryParams.city_state) {
            query = query.where('city_state', 'ilike', `${queryParams.city_state}%`);
        }

        if (queryParams.city) {
            query = query.where('city', 'ilike', `${queryParams.city}%`);
        }

        if (queryParams.neighbor) {
            query = query.where('neighbor', 'ilike', `${queryParams.neighbor}%`);
        }

        if (queryParams.street) {
            query = query.where('street', 'ilike', `${queryParams.street}%`);
        }

        if (queryParams.house_number) {
            query = query.where('house_number', 'ilike', `${queryParams.house_number}%`);
        }

        const resultSet = await query;

        if (resultSet.length === 0) {
            return [];
        }

        return resultSet.map(item => {
            return {
                id: item.id,
                user_profile_id: item.user_profile_id,
                city_state: item.city_state,
                city: item.city,
                neighbor: item.neighbor,
                street: item.street,
                house_number: item.house_number,
                postal_code: item.postal_code
            }
        })
    }

    public async updateAddress(addressId: number, address: AddressDto, trx: Knex.Transaction): Promise<AddressDto> {
        const resultSet = await trx('user_address')
            .update({
                city_state: address.city_state,
                city: address.city,
                neighbor: address.neighbor,
                street: address.street,
                house_number: address.house_number,
                postal_code: address.postal_code
            })
            .where('id', addressId)
            .returning('*')

        if (resultSet.length === 0) {
            console.log(resultSet)
            console.log(`Address ${addressId} not updated`)
            throw new EntityNotUpdatedError('Address not updated.');
        }

        return {
            id: resultSet[0].id,
            user_profile_id: resultSet[0].user_profile_id,
            city_state: resultSet[0].city_state,
            city: resultSet[0].city,
            neighbor: resultSet[0].neighbor,
            street: resultSet[0].street,
            house_number: resultSet[0].house_number,
            postal_code: resultSet[0].postal_code
        };
    }

    public async deleteAddressById(id: number, trx: Knex.Transaction): Promise<void> {
        const resultSet = await trx('user_address')
            .where('id', id)
            .del();

        if (!resultSet) {
            console.log(`Address ${id} not removed.`);
            throw new Error('Address not deleted.');
        }
    }
}