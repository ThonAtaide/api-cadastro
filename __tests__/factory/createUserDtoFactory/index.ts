import {CreateUserDto, UserFieldsValidator} from "../../../src/user/model";
import bcrypt from "bcrypt";
import {Knex} from "knex";

export const arnaldo: CreateUserDto = {
    username: 'ArnaldoCesar',
    password: 'GacibaM1lGr4u',
    name: 'Arnaldo Cesar Coelho',
    birth_day: '12-07-1950',
    gender: 'Male',
}

export const galvao: CreateUserDto = {
    username: 'GalvaoBueno128878dsdhgjdsgjsdjhd',
    password: 'VaiGanharVaiPerderNjr10EhHexaNos',
    name: 'Galvão Bueno',
    birth_day: '25-03-1945',
    gender: 'Male',
}

export const createUserToTest = async (user: CreateUserDto, trx: Knex.Transaction): Promise<number> => {
    const user_auth_result_set = await trx('user_auth')
        .insert({
            username: user.username,
            pass_word: bcrypt.hashSync(user.password, 12)
        }).returning('id');

    if (user_auth_result_set.length === 0) {
        throw Error('Problems to mock test.')
    }
    const user_id = user_auth_result_set[0];

    const resultSet = await trx('user_profile')
        .insert({
            name: user.name,
            birth_day: UserFieldsValidator.validateBirthDay(user.birth_day),
            gender: user.gender,
            user_id: user_id
        }).returning('id');

    if (resultSet.length === 0) {
        throw Error('Problems to mock test.')
    }

    return resultSet[0] as number;
}