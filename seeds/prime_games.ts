import { Knex } from "knex";
import { SteamWebAPI } from "../src/Core/steam";
import { differenceWith } from "lodash";

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
  const newGameInfo = await SteamWebAPI.getGameDetails(
    newGameAppIds.slice(50, 100)
  );
  const gameModels = newGameInfo.map((game) => {
    return {
      app_id: game.steam_appid,
      name: game.name,
      raw: game,
      summary: game.short_description,
      thumbnail_url: game.header_image,
    };
  });
  const gamesCreated = await knex("game").insert(gameModels).returning("*");
  // 4: Create price_overview relation where it exists.
  const pricingPromises = gamesCreated.map((game: any) => {
    if (game.raw.price_overview) {
      return knex("sales_info").insert({
        game_id: game.id,
        initial: game.raw.price_overview.initial,
        final: game.raw.price_overview.final,
        discount: game.raw.price_overview.discount_percent,
        date_updated: new Date(),
      });
    }
    return null;
  });
  await Promise.all(pricingPromises);
}
