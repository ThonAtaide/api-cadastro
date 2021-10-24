export const userRegisterSchema: any = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
        gender: { type: 'string' },
        birth_day: { type: 'string' }
    },
    required: ['username', 'password', 'name', 'birth_day'],
    additionalProperties: false
};
