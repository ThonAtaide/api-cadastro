export const userRegisterSchema: any = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
        gender: { type: 'string' },
        birth_day: { type: 'string' }
    },
    required: ['username', 'password', 'name'],
    additionalProperties: false
};

export const userUpdateSchema: any = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        gender: { type: 'string' },
        birth_day: { type: 'string' }
    },
    required: ['id', 'name'],
    additionalProperties: false
};
