import { Knex } from 'knex';
import { UserAuthenticationFetchDto, UserLoginRequestDto } from '../model';

export class UserAuthDao {


    public async findByUsername(
        username: string,
        trx: Knex.Transaction): Promise<UserAuthenticationFetchDto | null> {
        const resultSet = await trx('user_auth')
            .innerJoin('user_profile', 'user_profile.id', 'user_auth.id')
            .select(
                'user_auth.id',
                'user_auth.username',
                'user_auth.pass_word',
                'user_profile.id'
            )
            .where('user_auth.username', username);

        if (resultSet.length === 0) {
            return null;
        }

        return { user_id: resultSet[0].id, credentials: { username: resultSet[0].username, password: resultSet[0].pass_word }, user_profile_id: resultSet[0].user_profile && resultSet[0].user_profile.id };
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

}
