import { IPassword, Password } from '@Data/models/password';
import { IToken, Token } from '@Data/models/token';
import { Model } from 'objection';
/* eslint-disable @typescript-eslint/no-var-requires */

export interface IUser {
    id?: number | string;
    email: string;
    token?: IToken;
    password?: IPassword;
}

export class User extends Model implements IUser {
    public id?: number | string;
    public email!: string
    public token?: Token;
    public password?: Password;

    public static get tableName(): string {
        return 'user';
    }

    public static get jsonSchema(): any {
        return {
            type: 'object',
            required: ['email'],
            properties: {
                id: { type: 'number' },
                email: { type: 'string', minLength: 1, maxLength: 254 },
            },
        };
    }

    public static get relationMappings(): any {
        const { Token } = require('./token');
        const { Password } = require('./password');
        const { Game, UserGame } = require('./game');

        return {
            token: {
                relation: Model.HasOneRelation,
                modelClass: Token,
                join: {
                    from: 'user.id',
                    to: 'token.user_id',
                },
            },
            password: {
                relation: Model.HasOneRelation,
                modelClass: Password,
                join: {
                    from: 'user.id',
                    to: 'password.user_id',
                },
            },
            saved_games: {
                relation: Model.ManyToManyRelation,
                modelClass: Game,
                join: {
                    from: 'user.id',
                    to: 'game.id',
                    through: {
                        modelClass: UserGame,
                        from: 'user_game.user_id',
                        to: 'user_game.game_id',
                    },
                },
            }
        };
    }
}
