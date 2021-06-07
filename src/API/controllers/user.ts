import { NextFunction, Request, Response } from 'express';
import { CREATED, NOT_FOUND, OK } from 'http-status-codes';
import { UserService } from '@Business/services';
import { User } from '@Business/entities/user';
import { HttpError } from '@Core/shared/httpError';
import * as PassportJS from 'passport';
import * as AuthHelper from '@Core/shared/auth';
import { User as UserEntity, Token as TokenEntity } from '@Business/entities/user';

export class UserController {
    private userService: UserService;

    public constructor() {
        this.userService = new UserService();
    }

    public create = async (req: Request, res: Response): Promise<Response<UserEntity>> => {
        const user = await this.userService.createUser(req.body.email, req.body.password);
        return res.status(CREATED).json(new UserEntity(user));
    }

    public delete = async (req: Request, res: Response): Promise<Response> => {
        await this.userService.delete({ id: req.params.userId })
        return res.status(OK).json({ message: 'User successfully removed.'})
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<Response<UserEntity>> => {
        return PassportJS.authenticate(
            'local',
            { session: false },
            async (error: Error, user: User, message: string): Promise<Response> => {3
                    if (user) {
                        // authUser.rememberMe = req.body.rememberMe;
                        const userWithToken = await this.loginUser(user);
                        return res.status(OK).json(new UserEntity(userWithToken));
                    } else {
                        // if (info.incorrectPassword) {
                        //     await this.userService.updateFailedLogins(info.user);
                        // }
                        throw new HttpError(NOT_FOUND, message);
                    }
            },
        )(req, res, next);
    };

     /**
     * if the user is verified, create a new token and reset the failedLogins field.
     */
      private loginUser = async (authUser: UserEntity, rememberMe = true): Promise<UserEntity> => {
        const { token: jwt, expiration } = AuthHelper.generateJWT(authUser);
        const token = await this.userService.createToken(new TokenEntity({
            user_id: `${authUser.id}`,
            expiration_date: new Date(expiration * 1000),
            token: jwt,
        }));
        return new UserEntity({
            ...authUser,
            token,
        })
    };


}
