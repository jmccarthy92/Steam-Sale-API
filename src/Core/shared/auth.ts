import * as Crypto from 'crypto';
import { config } from '@Config';
import * as jwt from 'jsonwebtoken';
import { addSeconds } from 'date-fns';
import ExpressJwt from 'express-jwt';
import { ParamsDictionary, Request } from 'express-serve-static-core';

interface HashAndSalt {
    salt: string;
    hash: string;
}

export class Authentication {
    public static required(): ExpressJwt.RequestHandler {
        return ExpressJwt({
            secret: config.SECRET_KEY,
            userProperty: 'cookies[token]',
            algorithms: ['HS256'],
            getToken: Authentication.getToken,
        })
    }

    public static getToken(req: Request<ParamsDictionary>): string | null {
        const {
            headers: { authorization },
        } = req;
    
        if (authorization) {
            const [bearer, headerToken] = authorization.split(' ');
            if(bearer === 'Bearer') return headerToken;
            throw new Error('Invalid Authorization Token.');
        } else if (req.body?.token) {
            return req.body.token;
        } else if (req.query?.token) {
            return req.query.token;
        } else {
            return null;
        }
    
    }
    
}

export function getHash(password: string, salt: string): string {
    return Crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}

export function  getHashAndSalt(password: string): HashAndSalt {
    const salt = Crypto.randomBytes(16).toString('hex');
    const hash = getHash(password, salt);
    return { salt, hash };
}

export function hashPassword(password: string, salt: string): string {
    return Crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
}

export function generateJWT<T>(
    signingEntity: Partial<T>,
    lifespan = config.TOKEN_LIFESPAN,
): {
    token: string,
    fields: Partial<T>,
    expiration: number,
} {
    const expiration =  addSeconds(new Date(), lifespan).getTime() / 1000;
    const signature: Partial<T> = {
        ...signingEntity,
        exp: expiration,
    };
    return {
        token: jwt.sign(signature, config.SECRET_KEY),
        fields: signature,
        expiration, 
    };
}
