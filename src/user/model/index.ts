import { AddressDto } from '../../address/model';
import {InvalidParameterError, InvalidUsernameError} from "../../exceptions";
import moment from "moment";

export interface CreateUserDto {
    username: string;
    password: string;
    name: string;
    gender: string;
    birth_day: string;
}

export interface UserDto {
    id?: number;
    name: string;
    gender?: string;
    birth_day?: string;
    address?: Array<AddressDto>;
    user_id?: number;
}

export enum Gender {
    Male,
    Female ,
    Unidentified,
}

export class UserFieldsValidator {
    public static validateUsername(username: string) {
        const isValid = !!(/^[a-zA-Z0-9]+$/.exec(username))
        if (!isValid || username.length > 32) {
            throw new InvalidUsernameError('Username characters are invalid.');
        }
    }

    public static validatePassword(password: string) {
        const isValid = !!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.exec(password))
        if (!isValid || password.length > 32) {
            throw new InvalidUsernameError('Password characters are invalid.');
        }
    }

    public static validateBirthDay(birth_day: string): string {
        try {
            return moment(birth_day, "MM-DD-YYYY").format("MM-DD-YYYY");
        } catch (error) {
            throw new InvalidParameterError('Birth day invalid', null);
        }
    }

    public static validateGender(gender: string | undefined) {
        if (!gender || !(gender in Gender)) {
            throw new InvalidParameterError('Gender text is invalid', null);
        }
    }

    public static validateName(name: string) {
        if (name.length > 60) {
            throw new InvalidParameterError('Name size is bigger than allowed.', null);
        }
    }
}