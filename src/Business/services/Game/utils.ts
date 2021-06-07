import { Game as GameEntity } from "@Business/entities/game";

export const mapGames = (games: any[]): GameEntity[] => games.map((game) => new GameEntity(game));