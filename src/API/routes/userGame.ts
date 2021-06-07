import { Router } from "express";
import { Authentication } from "@Core/shared/auth";
import { UserGameController } from "@API/controllers/userGame";
import { gameValidations, validate } from "@API/validations";

export class UserGameRouter {
  private userGameController: UserGameController;

  public constructor() {
    this.userGameController = new UserGameController();
  }

  public init(): Router {
    const router: Router = Router();

    router.use(Authentication.required);

    router
      .route("/")
      /**
      * @swagger
      *
      * user/{userId}/game:
      *   get:
      *     summary: Gets games saved by the user
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: userId
      *         in: path
      *         type: integer
      *         required: true
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
      .get(gameValidations, validate, this.userGameController.get);

    
    router
      .route("/:gameId")
      /**
      * @swagger
      *
      * user/{userId}/game/{gameId}:
      *   post:
      *     summary: Saves game under user account.
      *     produces:
      *       - application/json
      *     parameters:
      *       - in: path
      *         name: userId
      *         type: integer
      *         required: true
      *       - in: query
      *         name: gameId
      *         type: integer
      *         required: true
      *     responses:
      *       200:
      *         description: "User Game."
      */
      .post(this.userGameController.save)
      /**
      * @swagger
      *
      * user/{userId}/game/{gameId}:
      *   delete:
      *     summary: Removed saved game from user account.
      *     produces:
      *       - application/json
      *     parameters:
      *       - in: path
      *         name: userId
      *         type: integer
      *         required: true
      *       - in: query
      *         name: gameId
      *         type: integer
      *         required: true
      *     responses:
      *       200:
      *         description: "Game Removed from users saved games."
      */
      .delete(this.userGameController.delete);

    return router;
  }
}
