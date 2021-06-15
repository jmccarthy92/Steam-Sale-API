import { Knex } from "knex";
import { SteamWebAPI } from "../src/Core/steam";
import { chunk, differenceWith } from "lodash";
import { IGame, ISalesInfo } from "@Data/models/game";
import ChunkedPromise from "@Core/shared/chunk";
import { IGameDetail } from "@Core/steam/types";

export async function seed(knex: Knex): Promise<void> {
  // Optional: Deletes ALL existing entries    
  // await knex("game").del();
  // 1a: Retrieve game names from steam into data structure
  const games = await SteamWebAPI.getAppList();
  // 1b: Retrieve existing games in database into data structure
  const existingGames = await knex("game").pluck("name");
  // 2: Compare games by name
  const newGames = differenceWith(
    games,
    existingGames,
    ({ name }, existingGameName) => name === existingGameName
  );
  const newGameAppIds = newGames.map(({ appid }) => appid);
  // 3: Retrieves new game info from steam and insert into database
  // const newGameInfo = await SteamWebAPI.getGameDetails(
  //   newGameAppIds.slice(50, 100)
  // );

  const chunkedGameDetailPromise = new ChunkedPromise(SteamWebAPI.getGameDetails, newGameAppIds);
  const newGameInfo = await chunkedGameDetailPromise.chunk<IGameDetail>(50, 10000);

  const gameModels = newGameInfo.map((game: IGameDetail): IGame => ({
      app_id: `${game.steam_appid}`,
      name: `${game.name}`,
      raw: game,
      summary: `${game.short_description}`,
      thumbnail_url: `${game.header_image}`,
    }
  ));
  const gamesCreated = await knex("game").insert(gameModels).returning("*");
  // 4: Create price_overview relation when it exists.
  const pricingModels = gamesCreated.reduce((pricing: ISalesInfo[], game: IGame) => {
    if (game.raw.price_overview && game.id) {
      pricing.push({
        game_id: +game.id,
        initial: game.raw.price_overview.initial,
        final: game.raw.price_overview.final,
        discount: game.raw.price_overview.discount_percent,
        date_updated: new Date(),
      });
    }
    return pricing;
  }, []);
  return knex('sales_info').insert(pricingModels)
}
