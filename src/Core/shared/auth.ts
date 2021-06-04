import * as Crypto from 'crypto';
import { config } from '@Config';
import * as jwt from 'jsonwebtoken';
import { addSeconds } from 'date-fns';

interface HashAndSalt {
    salt: string;
    hash: string;
}
3
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
