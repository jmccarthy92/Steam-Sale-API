import Service from "@Business/services/service";
import { Game as GameEntity } from "@Business/entities/game";
import { QueryOption } from "@Business/services/types";
import { UserGame } from "@Data/models/game";
import { mapGames } from "@Business/services/Game/utils";

export default class UserGameService extends Service<UserGame> {

  constructor() {
    super(UserGame);
  }

  public async getUserGamesPaginated(
    userId: number | string,
    fields: string[] = [this.SELECT_ALL],
    queryOption: QueryOption = {}
  ): Promise<GameEntity[]> {
    const { orderBy = "id", page = 1, pageSize = 100 } = queryOption;
    const result = await this.get(fields)
      .where("user_id", userId)
      .withGraphFetched("games")
      .orderBy(orderBy)
      .page(page, pageSize);
    return mapGames(result.results);
  }

  public async getUserGames(userId: number | string, fields: string[] = [this.SELECT_ALL]): Promise<GameEntity[]> {
    const userGames = await this.get(fields)
      .where("user_id", userId)
      .withGraphFetched("games");
    return mapGames(userGames);
  }

}
