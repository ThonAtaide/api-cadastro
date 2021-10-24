export interface CreateUserDto {
    username: string;
    password: string;
    name: string;
    gender: string;
    birth_day: string
}

export interface UserDto {
    id: number | null;
    name: string;
    gender: string;
    birth_day: string
}