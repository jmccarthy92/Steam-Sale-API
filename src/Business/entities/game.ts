export interface IGame {
    id?: number | string;
    app_id: string;
    name: string;
    thumbnail: string;
    summary: string;
    raw: Record<string, any>;
}

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
    public id?: string;
    public app_id: string;
    public name: string;
    public thumbnail: string;
    public summary: string;
    public raw: Record<string, any>;

    public constructor(game: IGame) {
        this.id = String(game.id);
        this.app_id = game.app_id;
        this.name = game.name;
        this.thumbnail = game.thumbnail;
        this.summary = game.summary;
        this.raw = game.raw;
    }
}