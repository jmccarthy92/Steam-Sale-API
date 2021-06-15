import { Model } from 'objection';
/* eslint-disable @typescript-eslint/no-var-requires */

export interface IPassword {
    id?: number | string;
    user_id: number | string;
    salt: string;
    hash: string;
    date_created: Date;
}

export class Password extends Model implements IPassword {
    public id?: number | string;
    public user_id!: number | string;
    public salt!: string;
    public hash!: string;
    public date_created!: Date;

    public static get tableName(): string {
        return 'password';
    }

    public static get jsonSchema(): any {
        return {
            type: 'object',
            required: ['user_id', 'salt', 'hash'],
            properties: {
                id: { type: 'number' },
                user_id: { type: 'number'},
                salt: { type: 'string' },
                hash: { type: 'string' },
                date_created: { type: 'date' },
            },
        };
    }

    public static get relationMappings(): any {
        const { User } = require('./user');

        return {
            token: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'password.user_id',
                    to: 'user.id',
                },
            },
        };
    }
}
