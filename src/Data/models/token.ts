import { Model } from 'objection';
/* eslint-disable @typescript-eslint/no-var-requires */

export interface IToken {
    id?: number | string;
    user_id: number | string;
    token: string;
    expiration_date?: Date;
}


export class Token extends Model implements IToken {
    public id?: number | string;
    public user_id!: number | string;
    public token!: string;
    public expiration_date?: Date;

    public static get tableName(): string {
        return 'token';
    }

    public static get jsonSchema(): any {
        return {
            type: 'object',
            required: ['user_id', 'token'],
            properties: {
                id: { type: 'number' },
                user_id: { type: 'number'},
                token: { type: 'string', minLength: 1, maxLength: 1000 },
                expiration_date: { type: 'date' },
            },
        };
    }

    public static get relationMappings(): any {
        const { User } = require('./user');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'token.user_id',
                    to: 'user.id',
                },
            },
        };
    }
}
