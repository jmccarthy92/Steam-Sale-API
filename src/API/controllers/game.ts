import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import GameService from '@Business/services/Game';
import { Game } from '@Business/entities/game';
import Mailer from '@Core/shared/mailer';

export class GameController {
    private gameService: GameService;

    public constructor() {
        this.gameService = new GameService();
    }

    public get = async (req: Request, res: Response): Promise<Response> => {
        const { orderBy, page, pageSize } = req.query;
        const games = await this.gameService.getAllGamesPaginated(["*"],{ orderBy, page, pageSize } );
        return res.json(games);
    };

    public save = async (req: Request, res: Response): Promise<Response> => {
        const { gameId, userId } = req.body;
        const userGame = await this.gameService.saveUserGame(gameId, userId);
        return res.status(200).json(userGame);
    }

}
