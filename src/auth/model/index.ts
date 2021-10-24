export interface UserLoginRequestDto {
    username: string;
    password: string
}

export interface UserLoggedDto {
    id: number
}

export interface UserAuthenticationFetchDto {
    user_id: number;
    credentials: UserLoginRequestDto;
    user_profile_id: number;
}
