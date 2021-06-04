import Service from '@Business/services';
import { Game as GameEntity } from '@Business/entities/game';
import { QueryOption } from '@Business/services/types';
import { Game, UserGame } from '@Data/models/game';

export default class GameService extends Service<Game> {
    private userGameService: Service<UserGame>;

    constructor() {
        super(Game);
        this.userGameService = new Service(UserGame);
    }

    public saveUserGame(gameId: number | string, userId: number | string): Promise<UserGame> {
        return this.userGameService.insert({ game_id: gameId, user_id: userId });
    } 

    public async getAllGamesPaginated(fields: string[] = [this.SELECT_ALL], queryOption: QueryOption = {}): Promise<GameEntity[]> {
        const {page = 1, pageSize = 100 } = queryOption;
        const result = await this.get(fields).orderBy(queryOption.orderBy).page(page, pageSize);
        return this.mapGames(result.results)
    }

    public async  getAllGames(fields: string[] = [this.SELECT_ALL], queryOption: QueryOption = {}): Promise<GameEntity[]> {
        const { orderBy  = 'id'} = queryOption; 
        const result = await this.get(fields).orderBy(orderBy);
        return this.mapGames(result)
    }

    public async getUserGames(userId: number | string): Promise<GameEntity[]> {
        const userGames = await this.get([this.SELECT_ALL]).where('user_id', userId).withGraphFetched('games');
        return this.mapGames(userGames);
    }

    private mapGames(games: any[]): GameEntity[] {
        return games.map((game) => new GameEntity(game))
    }

}