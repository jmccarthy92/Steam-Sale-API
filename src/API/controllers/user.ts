import { NextFunction, Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import UserService from '@Business/services/User';
import { User } from '@Business/entities/user';
import { HttpError } from '@Core/shared/httpError';
import * as PassportJS from 'passport';
import { config } from '@Config';
import * as AuthHelper from '@Core/shared/auth';
import { User as UserEntity, Token as TokenEntity } from '@Business/entities/user';

export class UserController {
    private userService: UserService;

    public constructor() {
        this.userService = new UserService();
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const user = await this.userService.createUser(req.body.email, req.body.password);
        return res.json(new UserEntity(user));
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        return PassportJS.authenticate(
            'local',
            { session: false },
            async (error: Error, user: User, message: string): Promise<Response> => {3
                    if (user) {
                        // authUser.rememberMe = req.body.rememberMe;
                        const userWithToken = await this.logAuthenticatedUserIn(user);
                        return res.status(200).json(new UserEntity(userWithToken));
                    } else {
                        // if (info.incorrectPassword) {
                        //     await this.userService.updateFailedLogins(info.user);
                        // }
                        throw new HttpError(404, message);
                    }
            },
        )(req, res, next);
    };

     /**
     * if the user is verified, create a new token and reset the failedLogins field.
     */
      private logAuthenticatedUserIn = async (authUser: UserEntity, rememberMe = true): Promise<UserEntity> => {
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
