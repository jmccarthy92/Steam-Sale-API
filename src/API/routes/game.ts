import { Router } from "express";
import { GameController } from "@API/controllers/game";
import { gameValidations, validate } from "@API/validations";

/**
 * @swagger
 *
 * parameters:
 *   orderByParam:
 *     name: orderBy
 *     in: query
 *     description: Field to sort results by.
 *     type: string
 *     required: true
 *   pageParam:
 *     name: page
 *     in: query
 *     description: Page of the current result set.
 *     type: integer
 *     format: int32
 *     required: true
 *   pageSizeParam:
 *     name: pageSize
 *     in: query
 *     description: Number of records returned in a result set.
 *     type: integer
 *     format: int32
 *     required: true
 *
 *
 */

export class GameRouter {
  private gameController: GameController;

  public constructor() {
    this.gameController = new GameController();
  }

  public init(): Router {
    const router: Router = Router();

    /**
     * @swagger
     *
     * /game:
     *   get:
     *     summary: Gets games saved
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '#/parameters/orderByParam'
     *       - $ref: '#/parameters/pageParam'
     *       - $ref: '#/parameters/pageSizeParam'
     *     responses:
     *       200:
     *         description: "Games."
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Game'
     */
    router.route("/").get(gameValidations, validate, this.gameController.get);

    return router;
  }
}
