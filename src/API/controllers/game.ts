import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import { GameService } from '@Business/services';
import { Game } from '@Business/entities/game';

export class GameController {
    private gameService: GameService;

    public constructor() {
        this.gameService = new GameService();
    }

    public get = async (req: Request, res: Response): Promise<Response<Game[]>> => {
        const { orderBy, page, pageSize } = req.query;
        const games = await this.gameService.getAllGamesPaginated(["*"],{ orderBy, page, pageSize } );
        return res.status(OK).json(games);
    };

}
