import { Router } from 'express';
import { UserController } from '@API/controllers/user';

export class UserRouter {
  private userController: UserController;

  public constructor() {
    this.userController = new UserController();
  }

  public init(): Router {
    const router: Router = Router();

    /**
    * @swagger
    *
    * /user:
    *   get:
    *     summary: Gets user saved
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
    *         description: "User."
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/User'
    */    
    router
      .route('/auth')
      .get(this.userController.login);

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
    router
      .route('/')
      .post(this.userController.create);

    return router;
  }
}
