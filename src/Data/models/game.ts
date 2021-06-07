import { Model } from 'objection';
/* eslint-disable @typescript-eslint/no-var-requires */

export class UserGame extends Model {
    public user_id!: number;
    public game_id!: number;

    public static get tableName(): string {
        return 'user_game';
    }

    public static get jsonSchema(): any {
        return {
            type: 'object',
            required: ['user_id', 'game_id'],
            properties: {
                id: { type: 'number' },
                user_id: { type: 'number'},
                game_id: { type: 'number'},
            },
        };
    }

    public static get relationMappings(): any {
        const { Game } = require('./game');

        return {
            games: {
                relation: Model.HasManyRelation,
                modelClass: Game,
                join: {
                    from: 'user_game.game_id',
                    to: 'game.id',
                }
            }
        };
    }
}

export class SalesInfo extends Model {
    public game_id!: number;
    public initial!: number;
    public final!: number;
    public discount!: number;
    public date_updated!: Date;

    public static get tableName(): string {
        return 'sales_info';
    }

    public static get jsonSchema(): any {
        return {
            type: 'object',
            required: ['game_id', 'initial', 'final', 'discount', 'date_updated'],
            properties: {
                id: { type: 'number' },
                game_id: { type: 'number'},
                initial: { type: 'number'},
                final: { type: 'number'},
                discount: { type: 'number'},
                date_updated: { type: 'date'},
            },
        };
    }
}


export class Game extends Model {
    public app_id!: string;
    public name!: string;
    public thumbnail!: string;
    public summary!: string;
    public raw!: Record<string, any>;

    public static get tableName(): string {
        return 'game';
    }

    public static get jsonSchema(): any {
        return {
            type: 'object',
            required: ['app_id'],
            properties: {
                id: { type: 'number' },
                app_id: { type: 'string', maxLength: 255},
                name: { type: 'string', maxLength: 255},
                thumbnail: { type: 'string', maxLength: 1000 },
                summary: { type: 'string', maxLength: 10000},
                raw: { type: 'object'},
            },
        };
    }

    public static get jsonAttributes(): any {
        return ['raw'];
    }

    public static get relationMappings(): any {
        const { User } = require('./user');

        return {
            saved_users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'games.id',
                    to: 'users.id',
                    through: {
                        modelClass: UserGame,
                        from: 'user_game.game_id',
                        to: 'user_game.user_id',
                    },
                },
            },
            sales_info: {
                relation: Model.HasOneRelation,
                modelClass: SalesInfo,
                join: {
                    from: 'games.id',
                    to: 'sales_info.game_id',
                }
            }
        };
    }
}
