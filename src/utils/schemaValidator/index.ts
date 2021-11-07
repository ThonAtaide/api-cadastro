import Ajv from 'ajv';
import { Request, Response, NextFunction } from 'express';

import { InvalidParameterError } from '../../exceptions';


const ajv = new Ajv({
    allErrors: true
});

export default (jsonSchema: any) => {
    const validator = ajv.compile(jsonSchema);
    return (req: Request, res: Response, next: NextFunction) => {
        if (!validator(req.body)) {
            const errors = validator.errors;
            throw new InvalidParameterError(ajv.errorsText(errors), errors);
        }
        next();
    };
}

