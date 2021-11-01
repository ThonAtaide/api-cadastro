export const addressCreateSchema: any = {
    type: 'object',
    properties: {
        city: { type: 'string' },
        city_state: { type: 'string' },
        neighbor: { type: 'string' },
        street: { type: 'string' },
        house_number: { type: 'string' },
        postal_code: { type: 'string' }
    },
    required: ['city', 'city_state', 'street', 'house_number'],
    additionalProperties: false
};

export const addressUpdateSchema: any = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        city: { type: 'string' },
        city_state: { type: 'string' },
        neighbor: { type: 'string' },
        street: { type: 'string' },
        house_number: { type: 'string' },
        postal_code: { type: 'string' }
    },
    required: ['id', 'city', 'city_state', 'street', 'house_number'],
    additionalProperties: false
};