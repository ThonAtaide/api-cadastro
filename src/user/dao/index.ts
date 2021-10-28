import { Knex } from 'knex';
import moment from 'moment';
import { EntityNotCreatedError, EntityNotUpdatedError } from '../../exceptions';
import { UserDto } from '../model/index';

export class UserProfileDao {

    public async createUser(
        user_auth_id: number,
        user: UserDto,
        trx: Knex.Transaction): Promise<UserDto> {
        console.log('user: ', user);
        const resultSet = await trx('user_profile')
            .insert({
                name: user.name,
                birth_day: user.birth_day,
                gender: user.gender,
                user_id: user_auth_id
            }).returning('*');

        if (resultSet.length === 0) {
            throw new EntityNotCreatedError('User not created.');
        }

        return {
            id: resultSet[0].id,
            name: resultSet[0].name,
            gender: resultSet[0].gender,
            birth_day: resultSet[0].birth_day
        };
    }

    public async findUserById(id: number, trx: Knex.Transaction): Promise<UserDto | null> {

        const resultSet = await trx('user_profile')
            .select('*')
            .where('id', id);

        if (resultSet.length === 0) {
            return null;
        }

        return {
            id: resultSet[0].id,
            name: resultSet[0].name,
            gender: resultSet[0].gender,
            birth_day: resultSet[0].birth_day && moment(resultSet[0].birth_day).format("DD-MM-YYYY"),
            user_id: resultSet[0].user_id
        }
    }

    public async updateUserProfile(
        id: number,
        user: UserDto,
        trx: Knex.Transaction): Promise<UserDto> {
        const resultSet = await trx('user_profile')
            .update({
                name: user.name,
                birth_day: user.birth_day,
                gender: user.gender
            }).where('id', id)
            .returning('*');

        if (resultSet.length === 0) {
            throw new EntityNotUpdatedError('User not updated.');
        }

        return {
            id: resultSet[0].id,
            name: resultSet[0].name,
            gender: resultSet[0].gender,
            birth_day: resultSet[0].birth_day && moment(resultSet[0].birth_day).format("DD-MM-YYYY")
        };
    }
}

