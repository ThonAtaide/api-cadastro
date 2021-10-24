import jwt from 'jsonwebtoken';
import { InvalidTokenError } from '../../exceptions/index';

export interface JwtPayloadData {
    username: string;
}

export interface JwtToken {
    token: String;
}

export default class JwtManager {

    private secret_key: string;
    constructor() {
        this.secret_key = 'dsjhdsgdsdsgjshjhskjdgshjdsfsagghsfhs'; //TODO replace by environment variable
    }

    public generateJwtToken(payload: JwtPayloadData): JwtToken {
        try {
            const token: string = jwt.sign(
                payload,
                this.secret_key,
                { expiresIn: '1h' }
            );
            return { token };
        } catch (err) {
            console.log(`Error trying to generate token: ${err}`);
            throw err;
        }

    }

    public validateJwtToken(token: string): JwtPayloadData {
        try {
            jwt.verify(token, this.secret_key);
            return this.decodeToken(token);
        } catch (err) {
            console.log(`Token invalid ${token}`);
            throw new InvalidTokenError();
        }
    }

    private decodeToken(token: string): JwtPayloadData {
        const decoded: any = jwt.decode(token);
        const payload: JwtPayloadData = decoded.payload;
        return payload;
    }
}