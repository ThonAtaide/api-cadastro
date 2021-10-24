import { CreateUserDto, UserDto } from "../model";
import { UserAuthDao } from '../../auth/dao/index';
import { UnauthorizedError, InvalidUsernameError, UsernameDuplicatedError, InvalidParameterError } from '../../exceptions';
import bcrypt from 'bcrypt';
import { Knex } from "knex";
import { UserProfileDao } from "../dao";
import moment from 'moment';
import { UserLoginRequestDto } from "../../auth/model";


export class UserService {

    private userAuthRepository: UserAuthDao;
    private userProfileRepository: UserProfileDao;
    private validGenders: string[] = [
        'Male',
        'Female',
        'Unidentified'
    ];

    constructor(repository: UserAuthDao, userProfileRepository: UserProfileDao) {
        this.userAuthRepository = repository;
        this.userProfileRepository = userProfileRepository;
    }

    public async createUser(user: CreateUserDto, trx: Knex.Transaction): Promise<UserDto> {

        this.validateUsername(user.username);
        this.validatePassword(user.password);
        this.validateBirthDay(user);
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
            id: null,
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

    private validateBirthDay(user: CreateUserDto) {
        try {
            user = { ...user, birth_day: moment(user.birth_day, "MM/DD/YYYY").toString() }
        } catch (error) {
            throw new InvalidParameterError('Birth day invalid', null);
        }
    }

    private validateGender(gender: string) {
        if (!this.validGenders.includes(gender)) {
            throw new InvalidParameterError('Gender text is invalid', null);
        }
    }

}