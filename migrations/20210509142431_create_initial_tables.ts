import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (table: any) => {
    table.increments("id").primary();
    table.string("email", 254).notNullable().unique();
  });

  await knex.schema.createTable("token", (table: any) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .unsigned()
      .index()
      .unique()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.timestamp("expiration_date");
    table.string("token", 1000).notNullable();
  });

  await knex.schema.createTable("password", (table: any) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .unsigned()
      .index()
      .unique()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.string("salt", 32).notNullable();
    table.string("hash", 1024).notNullable();
  });

  await knex.schema.createTable("game", (table: any) => {
    table.increments("id").primary();
    table.string("app_id", 255).notNullable().unique();
    table.string("name", 255).notNullable();
    table.string("thumbnail_url", 512);
    table.string("summary", 10000);
    table.jsonb("raw");
  });

  await knex.schema.createTable("sales_info", (table: any) => {
    table.increments("id").primary();
    table
      .integer("game_id")
      .notNullable()
      .unsigned()
      .index()
      .unique()
      .references("id")
      .inTable("game")
      .onDelete("CASCADE");
    table.integer("initial").notNullable();
    table.integer("final").notNullable();
    table.integer("discount").notNullable();
    table.timestamp("date_updated").notNullable();
  });

  await knex.schema.createTable("user_game", (table: any) => {
    table.increments("id").primary();
    table
      .integer("game_id")
      .notNullable()
      .unsigned()
      .index()
      .references("id")
      .inTable("game")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .notNullable()
      .unsigned()
      .index()
      .unique()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");

    table.unique(["game_id", "user_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable("sales_info")
    .dropTable("password")
    .dropTable("token")
    .dropTable("user_game")
    .dropTable("game")
    .dropTable("user");
}
