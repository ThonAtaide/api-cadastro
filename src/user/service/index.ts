import { CreateUserDto, UserDto } from "../model";
import { UserAuthDao } from '../../auth/dao/index';
import { UnauthorizedError, InvalidUsernameError, UsernameDuplicatedError, InvalidParameterError, NotFoundError } from '../../exceptions';
import bcrypt from 'bcrypt';
import { Knex } from "knex";
import { UserProfileDao } from "../dao";
import moment from 'moment';
import { UserLoginRequestDto } from "../../auth/model";
import { AddressDao } from "../../address/dao";
import {AddressDto} from "../../address/model";


export class UserService {

    private userAuthRepository: UserAuthDao;
    private userProfileRepository: UserProfileDao;
    private addressRepository: AddressDao;
    private validGenders: string[] = [
        'Male',
        'Female',
        'Unidentified'
    ];

    constructor(
        repository: UserAuthDao,
        userProfileRepository: UserProfileDao,
        addressRepository: AddressDao) {

        this.userAuthRepository = repository;
        this.userProfileRepository = userProfileRepository;
        this.addressRepository = addressRepository;
    }

    public async createUser(user: CreateUserDto, trx: Knex.Transaction): Promise<UserDto> {

        this.validateUsername(user.username);
        this.validatePassword(user.password);
        user = { ...user, birth_day: this.validateBirthDay(user.birth_day) };
        this.validateGender(user.gender);

        const existedUser = await this.userAuthRepository.findByUsername(user.username, trx);

        if (existedUser) {
            throw new UsernameDuplicatedError('This username is already registered.');
        }

        const newUserId: number = await this.userAuthRepository.createUser({
            username: user.username,
            password: bcrypt.hashSync(user.password, 12)
        }, trx);

        const userProfileDto: UserDto = {
            name: user.name,
            gender: user.gender,
            birth_day: user.birth_day
        }

        const userProfileCreatedId = await this.userProfileRepository.createUser(
            newUserId,
            userProfileDto,
            trx
        );

        return userProfileCreatedId;
    }

    public async getUser(userId: number, trx: Knex.Transaction): Promise<UserDto> {

        if (!userId) {
            throw new InvalidParameterError('User idenfier can not be null.', null)
        }

        const user = await this.userProfileRepository
            .findUserById(userId, trx);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const addressList = await this.addressRepository.findAddressByUser(userId, trx);

        return { ...user, address: this.addressListWithoutUserInfo(addressList), user_id: undefined };
    }

    public async updateUser(
        userId: number,
        userDto: UserDto,
        trx: Knex.Transaction): Promise<UserDto> {
        if (!userId || !userDto.id) {
            throw new InvalidParameterError('User identifier can not be null.', null)
        }

        if (userDto.birth_day) {
            userDto = {
                ...userDto, birth_day: this.validateBirthDay(userDto.birth_day)
            }
        }
        this.validateGender(userDto.gender);

        const updatedUser = await this.userProfileRepository
            .updateUserProfile(userId, userDto, trx);

        return updatedUser;
    }

    public async deleteUser(userId: number, trx: Knex.Transaction): Promise<void> {
        const user_profile = await this.userProfileRepository.findUserById(userId, trx);
        if (!user_profile || !user_profile.user_id) {
            throw new NotFoundError('User not found.');
        }
        await this.userAuthRepository.logicalDelete(user_profile.user_id, trx)
    }

    private addressListWithoutUserInfo(addressList: Array<AddressDto>): Array<AddressDto> {
        return addressList.map(item => {
            return {
                ...item, user_profile_id: undefined
            };
        })
    }

    private validateUsername(username: string) {
        const isValid = !!(/^[a-zA-Z0-9]+$/.exec(username))
        if (!isValid || username.length > 32) {
            throw new InvalidUsernameError('Username characters are invalid.');
        }
    }

    private validatePassword(password: string) {
        const isValid = !!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.exec(password))
        if (!isValid || password.length > 32) {
            throw new InvalidUsernameError('Password characters are invalid.');
        }
    }

    private validateBirthDay(birth_day: string): string {
        try {
            return moment(birth_day, "MM-DD-YYYY").format("MM-DD-YYYY");
        } catch (error) {
            throw new InvalidParameterError('Birth day invalid', null);
        }
    }

    private validateGender(gender: string | undefined) {
        if (gender && !this.validGenders.includes(gender)) {
            throw new InvalidParameterError('Gender text is invalid', null);
        }
    }

}