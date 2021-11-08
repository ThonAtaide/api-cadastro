import knex from '../../../src/utils/database';
import {Knex} from "knex";
import {UserService} from "../../../src/user/service";
import {UserAuthDao} from "../../../src/auth/dao";
import {UserProfileDao} from "../../../src/user/dao";
import {AddressDao} from "../../../src/address/dao";
import {arnaldo, galvao} from '../../factory/createUserDtoFactory/'
import {InvalidParameterError, UnauthorizedError} from "../../../src/exceptions";
import {Gender} from "../../../src/user/model";

describe('Testing user service', () => {

    let service: UserService;
    let trx: Knex.Transaction;

    beforeEach(async () => {
       service = new UserService(
           new UserAuthDao(),
           new UserProfileDao(),
           new AddressDao()
       );
       trx = await knex.transaction();
    });

    test('If user is successfully created.', async () => {
        const userCreated = await service.createUser(arnaldo, trx);

        expect(userCreated).not.toBeNull();
        expect(userCreated.id).not.toBeNull();
        expect(userCreated.name).toBe(arnaldo.name);
        expect(userCreated.gender).toBe(arnaldo.gender);
        expect(userCreated.birth_day).toBe(arnaldo.birth_day);

    });

    // test('If user has invalid fields - name length less than 4.', async () => {
    //     await expect(service.createUser({...arnaldo, name: 'cai'}, trx))
    //         .rejects
    //         .toThrow()
    // });

    // test('If user has invalid fields - name length more than 60', async () => {
    //     await expect(service.createUser({...arnaldo, name: 'fdhjdgjhgjdsfhgsafgfdsagfsajdjkshdsgjdsgjfasytryasytsaytrasyt'}, trx))
    //         .rejects
    //         .toThrow();
    // });

    // test('If user has invalid fields - Gender', async () => {
    //     await expect(service.createUser({...arnaldo, gender: 'male'}, trx))
    //         .rejects
    //         .toThrow(new InvalidParameterError('Gender text is invalid', null))
    // });

    // test('If user has valid fields - Gender Male', async () => {
    //     const userCreated = await service.createUser({...arnaldo, gender: Gender.Male.toString()}, trx);
    //
    //     expect(userCreated).not.toBeNull();
    //     expect(userCreated.id).not.toBeNull();
    //     expect(userCreated.name).toBe(arnaldo.name);
    //     expect(userCreated.gender).toBe(arnaldo.gender);
    //     expect(userCreated.birth_day).toBe(arnaldo.birth_day);
    // });
    //
    // test('If user has valid fields - Gender Female', async () => {
    //     const userCreated = await service.createUser({...arnaldo, gender: Gender.Female.toString()}, trx);
    //
    //     expect(userCreated).not.toBeNull();
    //     expect(userCreated.id).not.toBeNull();
    //     expect(userCreated.name).toBe(arnaldo.name);
    //     expect(userCreated.gender).toBe(arnaldo.gender);
    //     expect(userCreated.birth_day).toBe(arnaldo.birth_day);
    // });
    //
    // test('If user has valid fields - Gender Unidentified', async () => {
    //     const userCreated = await service.createUser({...arnaldo, gender: Gender.Unidentified.toString()}, trx);
    //
    //     expect(userCreated).not.toBeNull();
    //     expect(userCreated.id).not.toBeNull();
    //     expect(userCreated.name).toBe(arnaldo.name);
    //     expect(userCreated.gender).toBe(arnaldo.gender);
    //     expect(userCreated.birth_day).toBe(arnaldo.birth_day);
    // });

    // test('If user info is returned successfully.', () => {
    //
    // });
    //
    // test('If user is updated successfully.', () => {
    //
    // });
    //
    // test('If user updated fails.', () => {
    //
    // });

    afterAll(async () => {
        await trx.rollback();
    })
});