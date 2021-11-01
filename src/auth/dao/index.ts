import { Knex } from 'knex';
import moment from 'moment';
import { EntityNotUpdatedError } from '../../exceptions';
import { UserAuthenticationFetchDto, UserLoginRequestDto } from '../model';

export class UserAuthDao {


    public async findByUsername(
        username: string,
        trx: Knex.Transaction): Promise<UserAuthenticationFetchDto | null> {
        const resultSet = await trx('user_auth')
            .innerJoin('user_profile', 'user_profile.user_id', 'user_auth.id')
            .select(
                'user_auth.id',
                'user_auth.username',
                'user_auth.pass_word',
                'user_profile.id as user_profile_id'
            )
            .where('user_auth.username', username)
            .whereNull('deleted_at')

        if (resultSet.length === 0) {
            return null;
        }

        return {
            user_id: resultSet[0].id,
            credentials: {
                username: resultSet[0].username,
                password: resultSet[0].pass_word
            },
            user_profile_id: resultSet[0].user_profile_id
        };
    }

    public async createUser(
        user: UserLoginRequestDto,
        trx: Knex.Transaction
    ): Promise<number> {

        let resultSet = await trx('user_auth')
            .insert({
                username: user.username,
                pass_word: user.password
            }).returning('id');

        if (resultSet.length === 0) {
            throw new Error('An error ocurred and user was not created.'); //TODO improve
        }
        return resultSet[0];
    }

    public async logicalDelete(userId: number, trx: Knex.Transaction): Promise<void> {
        const resultSet = await trx('user_auth')
            .update({
                deleted_at: moment().format()
            }).where('id', userId)
            .returning('id');

        if (resultSet.length === 0) {
            throw new EntityNotUpdatedError('User not deleted.');
        }
    }

}
