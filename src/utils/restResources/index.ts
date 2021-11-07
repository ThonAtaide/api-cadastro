import { Request } from 'express';
import { InvalidParameterError, MissingParameterError } from "../../exceptions";

export const extractIdParams = (req: Request, entity: string) : number =>  {
    if (!req.params.id) {
        throw new MissingParameterError(`${entity} identifier is needed.`);
    }

    try {
        return parseInt(req.params.id);
    } catch (error) {
        console.log(`${entity} identifier is invalid: ${req.params.id}`);
        throw new InvalidParameterError(`${entity} identifier is invalid: ${req.params.id}`, null);
    }
}