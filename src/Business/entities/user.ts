import { IPassword } from "@Data/models/password";
import { IToken } from "@Data/models/token";
import { IUser } from "@Data/models/user";

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: "object"
 *       properties:
 *         id:
 *           type: "integer"
 *         user_id:
 *           type: "integer"
 *         token:
 *           type: "string"
 *           description: "Auth token"
 *         expiration_date:
 *           type: "date"
 *           description: "Date of token expiration"
 */
 export class Token implements IToken {
    public id?: number | string;
    public user_id: number | string;
    public token: string;
    public expiration_date?: Date;

    public constructor(token: IToken) {
        this.id = token.id ? String(token.id) : undefined;
        this.user_id = token.user_id;
        this.token = token.token;
        this.expiration_date = token.expiration_date;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: "object"
 *       properties:
 *         id:
 *           type: "integer"
 *         user_id:
 *           type: "integer"
 *         token:
 *           type: "string"
 *           description: "Auth token"
 *         expiration_date:
 *           type: "date"
 *           description: "Date of token expiration"
 */
 export class Password implements IPassword {
    public id?: number | string;
    public user_id: number | string;
    public salt: string;
    public hash: string;
    public date_created: Date;

    public constructor(password: IPassword) {
        this.id = password.id ? String(password.id) : undefined;
        this.user_id = password.user_id;
        this.salt = password.salt;
        this.hash = password.hash;
        this.date_created = password.date_created;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: "object"
 *       properties:
 *         id:
 *           type: "integer"
 *         email:
 *           type: "string"
 *           description: "Steam API App Id"
 *         token:
 *           $ref: '#/components/schemas/Token'
 */
export class User implements IUser {
    public id?: string;
    public email: string;
    public token?: IToken;
    public password?: IPassword;

    public constructor(user: IUser) {
        this.id = user.id ? String(user.id) : undefined;
        this.email = user.email;
        if(user.token) this.token = new Token(user.token);
        if(user.password) this.password = new Password(user.password);
    }
}