import {CreateUserDto, UserDto, UserFieldsValidator} from "../model";
import { UserAuthDao } from '../../auth/dao';
import { UsernameDuplicatedError, InvalidParameterError, NotFoundError } from '../../exceptions';
import bcrypt from 'bcrypt';
import { Knex } from "knex";
import { UserProfileDao } from "../dao";
import { AddressDao } from "../../address/dao";
import {AddressDto} from "../../address/model";

export class UserService {

    private userAuthRepository: UserAuthDao;
    private userProfileRepository: UserProfileDao;
    private addressRepository: AddressDao;

    constructor(
        repository: UserAuthDao,
        userProfileRepository: UserProfileDao,
        addressRepository: AddressDao) {

        this.userAuthRepository = repository;
        this.userProfileRepository = userProfileRepository;
        this.addressRepository = addressRepository;
    }

    public async createUser(user: CreateUserDto, trx: Knex.Transaction): Promise<UserDto> {

        UserFieldsValidator.validateUsername(user.username);
        UserFieldsValidator.validatePassword(user.password);
        UserFieldsValidator.validateName(user.name);
        user = { ...user, birth_day: UserFieldsValidator.validateBirthDay(user.birth_day) };
        UserFieldsValidator.validateGender(user.gender);

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

        return await this.userProfileRepository.createUser(
            newUserId,
            userProfileDto,
            trx
        );
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

        const addressList = await this.addressRepository.findAddressByUser(userId, {}, trx);

        return { ...user, address: this.addressListWithoutUserInfo(addressList), user_id: undefined };
    }

    public async updateUser(
        userId: number,
        userDto: UserDto,
        trx: Knex.Transaction): Promise<UserDto> {
        if (!userId || !userDto.id) {
            throw new InvalidParameterError('User identifier can not be null.', null)
        }

        UserFieldsValidator.validateName(userDto.name);
        if (userDto.birth_day) {
            userDto = {
                ...userDto, birth_day: UserFieldsValidator.validateBirthDay(userDto.birth_day)
            }
        }
        UserFieldsValidator.validateGender(userDto.gender);

        return await this.userProfileRepository.updateUserProfile(userId, userDto, trx);
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
}