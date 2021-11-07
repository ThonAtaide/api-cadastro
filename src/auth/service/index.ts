import { UserLoginRequestDto, UserLoggedDto, UserAuthenticationFetchDto } from '../model';
import { InvalidTokenError, UnauthorizedError } from '../../exceptions';
import JwtManager, { JwtPayloadData, JwtToken } from '../../utils/jwtToken';
import { UserAuthDao } from '../dao';
import { Knex } from 'knex';
import bcrypt from 'bcrypt';

const repository: UserAuthDao = new UserAuthDao();

export default class Authentication {

    private jwtManager: JwtManager;

    constructor() {
        this.jwtManager = new JwtManager();
    }

    public async authenticate(credentials: UserLoginRequestDto, trx: Knex.Transaction): Promise<JwtToken> {
        const user: UserAuthenticationFetchDto | null = await repository.findByUsername(credentials.username, trx);

        if (!user) {
            console.log('Username or password incorrect')
            throw new UnauthorizedError('Invalid username or password.');
        }

        if (!bcrypt.compareSync(credentials.password, user.credentials.password)) {
            throw new UnauthorizedError('Invalid username or password.');
        }

        return this.jwtManager.generateJwtToken({ username: credentials.username })
    }

    public async validateToken(token: string, trx: Knex.Transaction): Promise<UserLoggedDto> {
        const payload: JwtPayloadData = this.jwtManager.validateJwtToken(token);
        const user: UserAuthenticationFetchDto | null = await repository.findByUsername(payload.username, trx);

        if (!user) {
            console.log('User token not found.')
            throw new InvalidTokenError();
        }

        return { id: user.user_profile_id }
    }
}