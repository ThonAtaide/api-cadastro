import knex from '../../src/utils/database';

afterAll(async () => {
    await knex.destroy();
});