import { Request, Response } from 'express';
import { CREATED, NO_CONTENT, OK } from 'http-status-codes';
import { UserGameService } from '@Business/services';
import Mailer from '@Core/shared/mailer';
import { UserGame } from '@Data/models/game';
import { Game } from '@Business/entities/game';

export class UserGameController {
    private userGameService: UserGameService;

    public constructor() {
        this.userGameService = new UserGameService();
    }

    public get = async (req: Request, res: Response): Promise<Response<Game[]>> => {
        const { userId } = req.params;
        const { orderBy, page, pageSize } = req.query; 
        const games = await this.userGameService.getUserGamesPaginated(userId, ["*"],{ orderBy, page, pageSize})
        return res.status(OK).json(games);
    }

    public save = async (req: Request, res: Response): Promise<Response<UserGame>> => {
        const { gameId, userId } = req.params;
        const userGame = await this.userGameService.insert({ game_id: gameId, user_id: userId});
        return res.status(CREATED).json(userGame);
    }

    public delete = async (req: Request, res: Response): Promise<Response> => {
        const { gameId, userId } = req.params;
        await this.userGameService.delete({ user_id: userId, game_id: gameId });
        return res.status(NO_CONTENT).json({ message: 'Game successfully removed.'})
    }

}
