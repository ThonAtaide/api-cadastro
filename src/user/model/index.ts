import { AddressDto } from '../../address/model/index';

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
