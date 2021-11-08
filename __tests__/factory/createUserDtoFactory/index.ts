import {CreateUserDto} from "../../../src/user/model";
import bcrypt from "bcrypt";
import {Knex} from "knex";

export const arnaldo: CreateUserDto = {
    username: 'ArnaldoCesar',
    password: 'GacibaM1lGr4u',
    name: 'Arnaldo César Coelho',
    birth_day: '1950-07-12',
    gender: 'Male',
}

export const galvao: CreateUserDto = {
    username: 'GalvaoBueno128878dsdhgjdsgjsdjhd',
    password: 'VaiGanharVaiPerderNjr10EhHexaNos',
    name: 'Galvão Bueno',
    birth_day: '1945-03-25',
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
            birth_day: user.birth_day,
            gender: user.gender,
            user_id: user_id
        }).returning('id');

    if (resultSet.length === 0) {
        throw Error('Problems to mock test.')
    }

    return resultSet[0] as number;
}