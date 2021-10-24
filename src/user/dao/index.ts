import { Knex } from 'knex';
import { UserNotCreatedError } from '../../exceptions';
import { UserDto } from '../model/index';

export class UserProfileDao {

    public async createUser(
        user_auth_id: number,
        user: UserDto,
        trx: Knex.Transaction): Promise<UserDto> {

        const resultSet = await trx('user_profile')
            .insert({
                name: user.name,
                birth_day: user.birth_day,
                gender: user.gender,
                user_id: user_auth_id
            }).returning('*');

        if (resultSet.length === 0) {
            throw new UserNotCreatedError('User not created.');
        }

        return {
            id: resultSet[0].id,
            name: resultSet[0].name,
            gender: resultSet[0].gender,
            birth_day: resultSet[0].birth_day
        };
    }
}

