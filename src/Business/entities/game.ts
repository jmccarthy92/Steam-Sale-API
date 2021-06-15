import { IGame, ISalesInfo } from "@Data/models/game";

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: "object"
 *       properties:
 *         id:
 *           type: "string"
 *         app_id:
 *           type: "string"
 *           description: "Steam API App Id"
 *         name:
 *           type: "string"
 *           description: "Game Name"
 *         thumbnai:
 *           type: "string"
 *           description: "Thumbnail URL"
 *         summary:
 *           type: "string"
 *         raw:
 *           type: "object"
 */
export class Game implements IGame {
    public id?: number | string;
    public app_id: string;
    public name: string;
    public thumbnail_url: string;
    public summary: string;
    public raw: Record<string, any>;
    public sales_info?: Partial<SalesInfo>;

    public constructor(game: IGame) {
        this.id = String(game.id);
        this.app_id = game.app_id;
        this.name = game.name;
        this.thumbnail_url = game.thumbnail_url;
        this.summary = game.summary;
        this.raw = game.raw;
        if(game.sales_info) this.sales_info = game.sales_info;
    }
}

export class SalesInfo implements ISalesInfo {
    public game_id?: number;
    public initial: number;
    public final: number;
    public discount: number;
    public date_updated: Date;

    public constructor(salesInfo: ISalesInfo) {
        if(salesInfo.game_id) this.game_id = salesInfo.game_id;
        this.initial = salesInfo.initial;
        this.final = salesInfo.final;
        this.discount = salesInfo.discount;
        this.date_updated = salesInfo.date_updated;
    }
}