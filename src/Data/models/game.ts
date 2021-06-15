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

export interface ISalesInfo {
    game_id?: number;
    initial: number;
    final: number;
    discount: number;
    date_updated: Date;
}

export class SalesInfo extends Model implements ISalesInfo {
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

export interface IGame {
    id?: number | string;
    app_id: string;
    name: string;
    thumbnail_url: string;
    summary: string;
    raw: Record<string, any>;
    sales_info?: Partial<ISalesInfo>;
}

export class Game extends Model implements IGame {
    public id?: number | string;
    public app_id!: string;
    public name!: string;
    public thumbnail_url!: string;
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
                thumbnail_url: { type: 'string', maxLength: 1000 },
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
