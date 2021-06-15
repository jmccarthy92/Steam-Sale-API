import Service from "@Business/services/service";
import { Game as GameEntity } from "@Business/entities/game";
import { QueryOption } from "@Business/services/types";
import { Game, IGame } from "@Data/models/game";
import { mapGames } from "@Business/services/Game/utils";
import { SteamWebAPI } from "@Core/steam";
import { differenceBy } from "lodash";
import ChunkedPromise from "@Core/shared/chunk";
import { IGameDetail } from "@Core/steam/types";

export default class GameService extends Service<Game> {

  constructor() {
    super(Game);
  }

  public async refreshGamesStored() {
    const games = await SteamWebAPI.getAppList();
    const existingGames = await this.get([this.SELECT_ALL]);
    const newGames = differenceBy(games, existingGames, 'name');
    const newGameAppIds = newGames.map(({ appid }): number => appid);
    const chunkedGameDetailPromise = new ChunkedPromise(SteamWebAPI.getGameDetails, newGameAppIds);
    const newGameInfo = await chunkedGameDetailPromise.chunk<IGameDetail>(50, 10000);
    return this.createGamesFromSteam(newGameInfo)
  }

  private createGamesFromSteam(steamGames: IGameDetail[]): Promise<Game[]> {
    const gameModels = steamGames.map((game: IGameDetail): IGame => {
      const model: IGame = {
        app_id: `${game.steam_appid}`,
        name: `${game.name}`,
        raw: game,
        summary: `${game.short_description}`,
        thumbnail_url: `${game.header_image}`,
      }
      if(game.price_overview) {
        model.sales_info = {
          initial: game.price_overview.initital,
          final: game.price_overview.final,
          discount: game.price_overview.discount_percent,
          date_updated: new Date()
        }
      }
      return model;
    });
    return this.query().insertGraph(gameModels);

  }

  public async getAllGamesPaginated(
    fields: string[] = [this.SELECT_ALL],
    queryOption: QueryOption = {}
  ): Promise<GameEntity[]> {
    const { orderBy = "id", page = 1, pageSize = 100 } = queryOption;
    const result = await this.get(fields).withGraphJoined('sales_info').orderBy(orderBy).page(page, pageSize);
    return mapGames(result.results);
  }

  public async getAllGames(
    fields: string[] = [this.SELECT_ALL],
    queryOption: QueryOption = {}
  ): Promise<GameEntity[]> {
    const { orderBy = "id" } = queryOption;
    const result = await this.get(fields).withGraphJoined('sales_info').orderBy(orderBy);
    return mapGames(result);
  }
}
