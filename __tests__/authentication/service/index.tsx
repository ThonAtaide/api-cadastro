import knex from '../../../src/utils/database';
import Authentication from "../../../src/auth/service";
import {Knex} from "knex";
import {arnaldo, createUserToTest, galvao} from "../../factory/createUserDtoFactory";
import JwtManager from "../../../src/utils/jwtToken";
import {InvalidPasswordError, InvalidUsernameError, UnauthorizedError} from "../../../src/exceptions";

describe('Testing authentication service', () => {

        let service: Authentication;
        let trx: Knex.Transaction;
        let idArnaldo: number;
        let idGalvao: number;

        beforeAll(async () => {
            service = new Authentication(new JwtManager());
            trx = await knex.transaction();

            idArnaldo = await createUserToTest(arnaldo, trx);
            idGalvao = await createUserToTest(galvao, trx);
        });

        test('If use valid credentials to login - should login successfully. User Arnaldo', async () => {
            const token = await service.authenticate({username: arnaldo.username, password: arnaldo.password}, trx);
            expect(token).not.toBeNull()
            expect(token.token).not.toBeNull()
            expect(token.token.split('.').length).toBe(3);

            const userLoggedDto = await service.validateToken(token.token, trx);
            expect(userLoggedDto).not.toBeNull()
            expect(userLoggedDto.id).toBe(idArnaldo);
        })

        test('If use valid credentials to login (valid size of username and password) - should login successfully. User Galvao', async () => {
            const token = await service.authenticate({username: galvao.username, password: galvao.password}, trx);
            expect(token).not.toBeNull()
            expect(token.token).not.toBeNull()
            expect(token.token.split('.').length).toBe(3);

            const userLoggedDto = await service.validateToken(token.token, trx);
            expect(userLoggedDto).not.toBeNull()
            expect(userLoggedDto.id).toBe(idGalvao);
        })

        test('If use wrong password to login - should throw UnauthorizedError. User Arnaldo', async () => {
            await expect(
                service.authenticate({username: arnaldo.username, password: galvao.password}, trx)
            ).rejects
                .toThrow(new UnauthorizedError('Invalid username or password.'))
        })

        test('If use unknown username to login - should throw UnauthorizedError', async () => {
            await expect(service.authenticate({ username: 'loremIpsum', password: galvao.password}, trx))
                .rejects
                .toThrow(new UnauthorizedError('Invalid username or password.'))
        })

        test('If use invalid username (more than 32 characters) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: 'jhsdhgjsgjdsjfhsdjgdjjsdgjddshgft', password: galvao.password}, trx))
                .rejects
                .toThrow(new InvalidUsernameError('Username characters exceeded size limit.'));
        })

        test('If use invalid username (less than 6 characters) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: 'Cr7R9', password: galvao.password}, trx))
                .rejects
                .toThrow(new InvalidUsernameError('Username characters less than expected size.'));
        })

        test('If use invalid username (invalid characters) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: 'pass1258~', password: galvao.password}, trx))
                .rejects
                .toThrow(new InvalidUsernameError('Username characters are invalid.'));
        })

        test('If use invalid password (less than 8 characters) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: galvao.username, password: 'passwor'}, trx))
                .rejects
                .toThrow(new InvalidPasswordError('Password characters less than expected size.'));
        })

        test('If use invalid password (more than 32 characters) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: galvao.username, password: 'cafuLucioMarcosJuanMaiconDenilson'}, trx))
                .rejects
                .toThrow(new InvalidPasswordError('Password characters exceeded size limit.'));
        })

        test('If use invalid password (only numbers) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: galvao.username, password: '12345678'}, trx))
                .rejects
                .toThrow(new InvalidPasswordError('Password characters are invalid.'));
        })

        test('If use invalid password (only letters) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: galvao.username, password: 'password'}, trx))
                .rejects
                .toThrow(new InvalidPasswordError('Password characters are invalid.'));
        })

        test('If use invalid password (invalid characters) to login - should throw InvalidUsernameError', async () => {
            await expect(service.authenticate({ username: galvao.username, password: 'passwor~!'}, trx))
                .rejects
                .toThrow(new InvalidPasswordError('Password characters are invalid.'));
        })

    afterAll(async () => {
        trx.rollback();
    });

});
