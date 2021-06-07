import Service from "@Business/services/service";
import { Game as GameEntity } from "@Business/entities/game";
import { QueryOption } from "@Business/services/types";
import { Game } from "@Data/models/game";
import { mapGames } from "@Business/services/Game/utils";

export default class GameService extends Service<Game> {

  constructor() {
    super(Game);
  }

  public async getAllGamesPaginated(
    fields: string[] = [this.SELECT_ALL],
    queryOption: QueryOption = {}
  ): Promise<GameEntity[]> {
    const { orderBy = "id", page = 1, pageSize = 100 } = queryOption;
    const result = await this.get(fields).orderBy(orderBy).page(page, pageSize);
    return mapGames(result.results);
  }

  public async getAllGames(
    fields: string[] = [this.SELECT_ALL],
    queryOption: QueryOption = {}
  ): Promise<GameEntity[]> {
    const { orderBy = "id" } = queryOption;
    const result = await this.get(fields).orderBy(orderBy);
    return mapGames(result);
  }
}
