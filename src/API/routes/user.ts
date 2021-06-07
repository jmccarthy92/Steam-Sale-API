import { Router } from "express";
import { UserController } from "@API/controllers/user";
import { Authentication } from "@Core/shared/auth";
import { userCanAccessEntity, userValidations, validate } from "@API/validations";
import { UserGameRouter } from "@API/routes/userGame";

export class UserRouter {
  private userController: UserController;

  public constructor() {
    this.userController = new UserController();
  }

  public init(): Router {
    const router: Router = Router();

    router
      .route("/auth")
      /**
      * @swagger
      *
      * /user/auth:
      *   get:
      *     summary: Logs in user
      *     produces:
      *       - application/json
      *     parameters:
      *       - in: query
      *         name: email
      *         required: true
      *         type: string
      *       - in: query
      *         name: password
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: "Logged-in User."
      *         content:
      *           application/json:
      *             schema:
      *               $ref: '#/components/schemas/User'
      */
      .post(userValidations, validate, this.userController.login);

    
    router
      .route("/")
      /**
      * @swagger
      *
      * /user:
      *   post:
      *     summary: Create user
      *     produces:
      *       - application/json
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             $ref: '#/components/schemas/User'
      *     responses:
      *       200:
      *         description: "User."
      *         content:
      *           application/json:
      *             schema:
      *               $ref: '#/components/schemas/User'
      */
      .post(userValidations, validate, this.userController.create);

    
    router
      .route("/:userId")
      /**
      * @swagger
      *
      * /user/{userId}:
      *   delete:
      *     summary: Removes user.
      *     produces:
      *       - application/json
      *     parameters:
      *       - in: path
      *         name: userId
      *         type: integer
      *         required: true
      *     responses:
      *       200:
      *         description: "User removed from system."
      */
      .delete(Authentication.required, userCanAccessEntity, this.userController.delete);

    router.use('/:userId/game', userCanAccessEntity, new UserGameRouter().init())

    return router;
  }
}
