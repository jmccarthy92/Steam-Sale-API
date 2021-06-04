import { Router } from 'express';
import { GameController } from '@API/controllers/game';

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
    *       - in: query
    *         name: fields
    *         schema:
    *           type: array
    *           items:
    *             type: string
    *       - in: query
    *         name: orderBY
    *         schema:
    *           type: string
    *     responses:
    *       200:
    *         description: "Games."
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Game'
    */    
    router
      .route('/')
      .get(this.gameController.get)

    return router;
  }
}
